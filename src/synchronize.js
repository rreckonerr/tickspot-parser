import config from './config';
import { TickSource, TickTarget, logger } from './helpers';
import { ProjectCtrl, UserCtrl, ClientCtrl, TaskCtrl } from './controllers';

const initTickApi = async () => {
  const {
    sourceLogin,
    sourcePassword,
    sourceUserAgent
    // targetLogin,
    // targetPassword,
    // targetUserAgent
  } = config.secrets;

  const [err1, targetRole] = await TickTarget.init(
    sourceLogin,
    sourcePassword,
    sourceUserAgent
  );
  try {
    if (err1) throw Error(`Failed to init Tick Target`, err1.message || err1);
  } catch (error) {
    logger.error(`Exit code 1`, { reason: error.message || error });
    process.exit(1);
  }

  return targetRole;
};

const fetchAllProjectsFromDb = async () => {
  try {
    const projects = await ProjectCtrl.fetchAllProjects();

    return [null, projects];
  } catch (error) {
    logger.error(`Failed to fetch projects from db`, {
      reason: error.message || error
    });
    return [error];
  }
};

const synchronizeProjects = async () => {
  try {
    const [err, sourceProjectsRaw] = await fetchAllProjectsFromDb();
    if (err)
      throw Error(
        'Failed to fetch all projects from DB.',
        err.message || error
      );

    const sourceProjects = sourceProjectsRaw.map(project =>
      project.get({ plain: true })
    );

    const targetProjects = [];
    for await (const targetProject of createTargetProjects(sourceProjects)) {
      if (targetProject) targetProjects.push(targetProject);
    }

    console.log('---target-projects', targetProjects);

    // TODO: update db with the new projects data

    return [null, targetProjects];
  } catch (error) {
    logger.error(`Failed to synchronize projects.`, {
      reason: error.message || error
    });
    process.exit(1);
  }
};

async function* createTargetProjects(projects) {
  let i = 0;
  while (i < projects.length) {
    try {
      const sourceProject = projects[i];

      const {
        name,
        budget,
        date_closed,
        notifications,
        billable,
        recurring,
        client_id,
        owner_id
      } = sourceProject;

      const projectToCreate = {
        name,
        budget,
        date_closed,
        notifications,
        billable,
        recurring,
        // ! link to target's client id
        client_id,
        // ! link to target's user id
        owner_id
      };

      const [err, targetProject] = await TickTarget.createProject(
        projectToCreate
      );
      if (err) throw Error(err.message || error);

      yield targetProject;
    } catch (error) {
      logger.error(`Failed to create target project for ${projects[i].name}`, {
        reason: error.message || error
      });
      yield undefined;
    } finally {
      i++;
    }
  }
}

const fetchAllUsersFromDb = async () => {
  try {
    const users = await UserCtrl.fetchAllUsers();

    return [null, users];
  } catch (error) {
    logger.error(`Failed to fetch users from db`, {
      reason: error.message || error
    });
    return [error.message || error];
  }
};

const synchronizeUsers = async () => {
  try {
    const [err, sourceUsersRaw] = await fetchAllUsersFromDb();
    if (err) throw Error('Failed to fetch all users from DB');

    const sourceUsers = sourceUsersRaw.map(user => user.get({ plain: true }));

    console.log('--source-users', sourceUsers);
    const targetUsers = [];
    for await (const targetUser of createTargetUsers(sourceUsers)) {
      if (targetUser) targetUsers.push(targetUser);
    }

    console.log('---target-users', targetUsers);

    // TODO: update db with the new data.
    return [null, targetUsers];
  } catch (error) {
    logger.error(`Failed to synchronize users.`, {
      reason: error || error.message
    });
    process.exit(1);
  }
};

async function* createTargetUsers(users) {
  let i = 0;
  while (i < users.length) {
    try {
      const sourceUser = users[i];

      const { first_name, last_name, email, admin, billable_rate } = sourceUser;

      const userToCreate = {
        first_name,
        last_name,
        email,
        admin: Boolean(admin),
        billable_rate
      };

      const [err, targetUser] = await TickTarget.createUser(userToCreate);
      if (err) throw Error(err.message || error);

      yield targetUser;
    } catch (error) {
      logger.error(`Failed to create target user for ${user[i].email}`, {
        reason: error.message || error
      });
      yield undefined;
    } finally {
      i++;
    }
  }
}

const fetchAllClientsFromDb = async () => {
  try {
    const clients = await ClientCtrl.fetchAllClients();

    return [null, clients];
  } catch (error) {
    return [
      new Error('Failed to retreive clients from DB.', error.message || error)
    ];
  }
};

const synchronizeClients = async () => {
  try {
    const [err, sourceClientsRaw] = await fetchAllClientsFromDb();
    if (err)
      throw Error(`Failed to fetch all clients from DB.`, err.message || err);

    const sourceClients = sourceClientsRaw.map(client =>
      client.get({ plain: true })
    );

    const targetClients = [];
    for await (const targetClient of createTargetClients(sourceClients)) {
      if (targetClient) targetClients.push(targetClient);
    }
    console.log('---target-clients', targetClients);

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

async function* createTargetClients(clients) {
  let i = 0;
  while (i < clients.length) {
    const sourceClient = clients[i];
    const { name, archived } = sourceClient;

    try {
      const clientToCreate = {
        name,
        archived: archived ? archived : false
      };

      const [err, targetClient] = await TickTarget.createClient(clientToCreate);
      if (err) throw Error(err.message || err);

      yield targetClient;
    } catch (error) {
      logger.error(`Failed to create target client for ${sourceClient.name}`, {
        reason: error.message || error
      });
      yield undefined;
    } finally {
      i++;
    }
  }
}

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

const init = async () => {
  try {
    await initTickApi();
    // await synchronizeUsers();
    // await synchronizeClients();
    // await synchronizeProjects();
    await synchronizeTasks();
  } catch (error) {
    logger.error(`Failed to synchronize`, { reason: error.message || error });
  }
};

export default init;
