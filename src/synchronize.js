import config from './config';
import { TickTarget, logger } from './helpers';
import {
  ProjectCtrl,
  UserCtrl,
  ClientCtrl,
  TaskCtrl,
  EntryCtrl
} from './controllers';

const initTickApi = async () => {
  try {
    const { targetLogin, targetPassword, targetUserAgent } = config.secrets;

    const [err1, targetRole] = await TickTarget.init(
      targetLogin,
      targetPassword,
      targetUserAgent
    );
    if (err1) throw Error(`Failed to init Tick Target`, err1.message || err1);

    logger.info(`Initialized TickTarget!`);
    return targetRole;
  } catch (error) {
    logger.error(`Exit code 1`, { reason: error.message || error });
    process.exit(1);
  }
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

    // TODO: update db with the new projects data
    logger.info(
      `Created ${targetProjects.length} of ${sourceProjects.length} projects`
    );

    return targetProjects;
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
    return targetUsers;
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
    return targetClients;
  } catch (error) {
    logger.error(`Failed to synchronize clients.`, {
      reason: error.message || error
    });
    process.exit(1);
  }
};

const synchronizeTasks = async () => {
  try {
    const [err, sourceDbTasksRaw] = await TaskCtrl.fetchAllTasks();
    if (err) {
      throw Error(`Failed to fetch all tasks from DB.`, err.message || err);
    }

    const sourceTasks = sourceDbTasksRaw.map(task => task.get({ plain: true }));

    const [err1, targetTasks] = await TickTarget.createTasks(sourceTasks);
    if (err1) {
      throw Error(`Failed to create clients in target` + err1.message || err1);
    }

    logger.info(`Created ${targetTasks.length} of ${sourceTasks.length} tasks`);

    // TODO: update db with the new data
    return targetTasks;
  } catch (error) {
    logger.error(`Failed to syncronize tasks.`, {
      reason: error.message || error
    });
    process.exit(1);
  }
};

const synchronizeEntries = async () => {
  try {
    const [err, sourceDbEntriesRaw] = await EntryCtrl.fetchAllEntries();
    if (err) {
      throw Error(`Failed to fetch all entries from DB`, err.message || err);
    }

    const sourceEntries = sourceDbEntriesRaw.map(entry =>
      entry.get({ plain: true })
    );

    const [err1, targetEntries] = await TickTarget.createEntries(sourceEntries);
    if (err1) {
      throw Error(`Failed to create entries in target`, err1.message || err1);
    }

    logger.info(
      `Created ${targetEntries.length} of ${sourceEntries.length} entries`
    );

    return targetEntries;
  } catch (error) {
    logger.error(`Failed to syncronize entries.`, {
      reason: error.message || error
    });
    process.exit(1);
  }
};

const init = async () => {
  try {
    await initTickApi();

    await synchronizeUsers();
    await synchronizeClients();
    await synchronizeProjects();
    await synchronizeTasks();
    await synchronizeEntries();
  } catch (error) {
    logger.error(`Failed to synchronize`, { reason: error.message || error });
    process.exit(1);
  }
};

export default init;
