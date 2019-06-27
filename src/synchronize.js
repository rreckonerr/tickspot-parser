import config from './config';
import { TickSource, TickTarget, logger } from './helpers';
import {
  ProjectCtrl,
  UserCtrl,
  ClientCtrl,
  TaskCtrl,
  EntryCtrl
} from './controllers';

const initTickApi = async () => {
  const { targetLogin, targetPassword, targetUserAgent } = config.secrets;

  const [err1, targetRole] = await TickTarget.init(
    targetLogin,
    targetPassword,
    targetUserAgent
  );
  try {
    if (err1) throw Error(`Failed to init Tick Target`, err1.message || err1);
  } catch (error) {
    logger.error(`Exit code 1`, { reason: error.message || error });
    process.exit(1);
  }

  return targetRole;
};

const synchronizeProjects = async () => {
  try {
    const [err, sourceDbProjectsRaw] = await ProjectCtrl.fetchAllProjects();
    if (err)
      throw Error(
        'Failed to fetch all projects from DB.',
        err.message || error
      );

    const sourceProjects = sourceDbProjectsRaw.map(project =>
      project.get({ plain: true })
    );

    const [err1, targetProjects] = await TickTarget.createProjects(
      sourceProjects
    );
    if (err1)
      throw Error(`Failed to create projects in target`, err1.message || err1);

    console.log('---target-projects', targetProjects);

    // TODO: update db with the new projects data
    logger.info(
      `Created ${targetProjects.length} of ${sourceProjects.length} projects`
    );

    return [null, targetProjects];
  } catch (error) {
    logger.error(`Failed to synchronize projects.`, {
      reason: error.message || error
    });
    process.exit(1);
  }
};

const synchronizeUsers = async () => {
  try {
    const [err, sourceDbUsersRaw] = await UserCtrl.fetchAllUsers();
    if (err) {
      throw Error('Failed to fetch all users from DB ' + err.message || err);
    }

    const sourceUsers = sourceDbUsersRaw.map(user => user.get({ plain: true }));

    const [err1, targetUsers] = await TickTarget.createUsers(sourceUsers);
    if (err1) {
      throw Error(`Failed to create users in target. ` + err1.message || err1);
    }

    logger.info(`Created ${targetUsers.length} of ${sourceUsers.length} users`);
    // TODO: update db with the new data.
    return [null, targetUsers];
  } catch (error) {
    logger.error(`Failed to synchronize users.`, {
      reason: error || error.message
    });
    process.exit(1);
  }
};

const synchronizeClients = async () => {
  try {
    const [err, sourceDbClientsRaw] = await ClientCtrl.fetchAllClients();
    if (err)
      throw Error(`Failed to fetch all clients from DB.`, err.message || err);

    const sourceClients = sourceDbClientsRaw.map(client =>
      client.get({ plain: true })
    );

    const [err1, targetClients] = await TickTarget.createClients(sourceClients);
    if (err1) {
      throw Error(`Failed to create clients in target`, err1.message || err1);
    }

    console.log('---target-clients', targetClients);
    logger.info(
      `Created ${targetClients.length} of ${sourceClients.length} clients successfully`
    );

    // ? response example
    // { id: 375015,
    // name: 'My New Test Name',
    // archive: false,
    // url:
    //  'http://secure.tickspot.com/126919/api/v2/clients/375015.json',
    // updated_at: '2019-06-25T11:27:27.000-04:00' }
    // TODO: update db with the new relationships
    return [null, targetClients];
  } catch (error) {
    logger.error(`Failed to synchronize clients.`, {
      reason: error.message || error
    });
    process.exit(1);
  }
};

const fetchAllTasksFromDb = async () => {
  try {
    const tasks = await TaskCtrl.fetchAllTasks();

    return [null, tasks];
  } catch (error) {
    return [
      new Error('Failed to retrieve tasks from DB.', error.message || error)
    ];
  }
};

const synchronizeTasks = async () => {
  try {
    const [err, sourceTasksRaw] = await fetchAllTasksFromDb();
    if (err) {
      throw Error(`Failed to fetch all tasks from DB.`, err.message || err);
    }

    const sourceTasks = sourceTasksRaw.map(task => task.get({ plain: true }));

    const targetTasks = [];

    for await (const targetTask of createTargetTasks(sourceTasks)) {
      if (targetTask) targetTasks.push(targetTask);
    }

    console.log('---target-tasks', targetTasks);
    logger.info(`Created ${targetTasks.length} tasks successfully`);

    // TODO: update db with the new data
    return [null, targetTasks];
  } catch (error) {
    logger.error(`Failed to syncronize tasks.`, {
      reason: error.message || error
    });
    process.exit(1);
  }
};

async function* createTargetTasks(tasks) {
  let i = 0;
  while (i < tasks.length) {
    const sourceTask = tasks[i];
    const { name, budget, project_id, billable } = sourceTask;

    try {
      const taskToCreate = {
        name,
        budget,
        // ! add real target project id
        project_id,
        billable: Boolean(billable)
      };

      const [err, targetTask] = await TickTarget.createTask(taskToCreate);
      if (err) throw Error(err.message || err);

      yield targetTask;
    } catch (error) {
      logger.error(`Failed to create target task for ${sourceTask[i].name}`, {
        reason: error.message || error
      });
      yield undefined;
    } finally {
      i++;
    }
  }
}

const fetchAllEntriesFromDb = async () => {
  try {
    const entries = await EntryCtrl.fetchAllEntries();

    return [null, entries];
  } catch (error) {
    return [
      new Error('Failed to retreive entries from DB.', error.message || error)
    ];
  }
};

const synchronizeEntries = async () => {
  try {
    const [err, sourceEntriesRaw] = await fetchAllEntriesFromDb();
    if (err) {
      throw Error(`Failed to fetch all entries from DB`, err.message || err);
    }

    const sourceEntries = sourceEntriesRaw.map(entry =>
      entry.get({ plain: true })
    );

    const targetEntries = [];

    for await (const targetEntry of createTargetEntries(sourceEntries)) {
      if (targetEntry) targetEntries.push(targetEntry);
    }

    console.log('---target-entries', targetEntries);

    logger.info(`Created ${targetEntries.length} entries successfully`);

    return [null, targetEntries];
  } catch (error) {
    logger.error(`Failed to syncronize entries.`, {
      reason: error.message || error
    });
    process.exit(1);
  }
};

async function* createTargetEntries(entries) {
  let i = 0;
  while (i < entries.length) {
    const sourceEntry = entries[i];
    const { date, hours, notes, task_id, user_id } = sourceEntry;

    try {
      const entryToCreate = {
        date,
        hours,
        notes,
        // ! add target task id
        task_id,
        // ! add target user id
        user_id
      };

      const [err, targetEntry] = await TickTarget.createEntry(entryToCreate);
      if (err) throw Error(err.message || err);

      yield targetEntry;
    } catch (error) {
      logger.error(`Failed to create target entry for ${notes}`, {
        reason: error.message || error
      });
      yield undefined;
    } finally {
      i++;
    }
  }
}

const init = async () => {
  try {
    await initTickApi();

    // await synchronizeUsers();
    // await synchronizeClients();
    await synchronizeProjects();
    // await synchronizeTasks();
    // await synchronizeEntries();
  } catch (error) {
    logger.error(`Failed to synchronize`, { reason: error.message || error });
    process.exit(1);
  }
};

export default init;
