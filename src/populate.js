import config from './config';
import { TickSource, logger } from './helpers';
import { Subscription, Project, User, Entry, Task, Client } from './models';

const saveClientsToDb = async clients => {
  return await clients.forEach(async client => {
    await Client.create(client)
      .then(() => {
        logger.info(`Client ${client.id} is added to DB succesfully!`);
      })
      .catch(err => {
        logger.error(`Failed to add client ${client.id} to the DB.`, {
          reason: err.message || err
        });
      });
  });
};

const saveEntriesToDb = async entries => {
  return await entries.forEach(async entry => {
    await Entry.create(entry)
      .then(() => {
        logger.info(`Entry ${entry.id} created succesfully!`);
      })
      .catch(err => {
        logger.error(`Failed to create entry ${entry.id}`, {
          reason: err.message || err
        });
      });
  });
};

const saveUsersToDb = async (users, subscription_id) => {
  return await users.forEach(async user => {
    await User.create({ ...user, subscription_id: subscription_id })
      .then(() => {
        logger.info(`User ${user.email} created succesfully!`);
      })
      .catch(err => {
        logger.error(`Failed to create user ${user.email}`, {
          reason: err.message || err
        });
      });
  });
};

const saveTasksToDb = async tasks => {
  return await tasks.forEach(async task => {
    Task.create(task)
      .then(() => {
        logger.info(`Task ${task.name} created succesfully!`);
      })
      .catch(err => {
        logger.error(`Failed to create task ${task.name}`, {
          reason: err.message || err
        });
      });
  });
};

const saveProjectsToDb = async (projects, subscription_id) => {
  return projects.forEach(project => {
    Project.create({ ...project, subscription_id })
      .then(() => {
        logger.info(`Project ${project.name} created succesfully!`);
      })
      .catch(err => {
        logger.error(`Failed to create project ${project.name}`, {
          reason: err.message || err
        });
      });
  });
};

const saveSubscriptionToDb = async role => {
  return await Subscription.create(role)
    .then(() => {
      logger.info(`Subscription ${role.company} created succesfully!`);
    })
    .catch(err => {
      logger.error('Failed to create subscr', {
        reason: err.message || err
      });
    });
};

const init = async () => {
  try {
    logger.info('Starting the app!');
    const {
      sourceLogin,
      sourcePassword,
      sourceUserAgent
      // targetLogin,
      // targetPassword,
      // targetUserAgent
    } = config.secrets;

    const [err0, sourceRole] = await TickSource.init(
      sourceLogin,
      sourcePassword,
      sourceUserAgent
    );
    if (err0) {
      logger.error(`Failed to init TickSource`, {
        reason: err0.message || err0
      });
    }

    const { subscription_id, company, api_token } = sourceRole;
    const dbRole = { id: subscription_id, company, api_token };

    // console.log('---sourceRole', sourceRole);
    await saveSubscriptionToDb(dbRole);

    const [err1, sourceProjects] = await TickSource.getAllProjects();
    if (err1) {
      logger.error(`Failed to get all projects for source`, {
        reason: err1.message || err1
      });
    }

    // console.log('---source-projects', sourceProjects);
    await saveProjectsToDb(sourceProjects, subscription_id);

    const fromDate = '2019-06-01';

    const [err2, entries] = await TickSource.getAllEntries(fromDate);
    if (err2) {
      logger.error(`Failed to get source entries`, {
        reason: err2.message || err2
      });
    }

    // console.log('---entries', entries);
    await saveEntriesToDb(entries);

    const [err3, users] = await TickSource.getAllUsers();
    if (err3) {
      logger.error('Failed to get source users', {
        reason: err3.message || err3
      });
    }

    // console.log('---users', users);
    await saveUsersToDb(users, subscription_id);

    const [err4, tasks] = await TickSource.getAllTasks();
    if (err4) {
      logger.error('Failed to get all tasks', {
        reason: err4.message || err4
      });
    }

    // console.log('---tasks', tasks);
    await saveTasksToDb(tasks);

    const [err5, clients] = await TickSource.getAllClients();
    if (err5) {
      logger.error(`Failed to get clients`, { reason: err5.message || err5 });
    }
    // console.log('---clients', clients);
    await saveClientsToDb(clients);
  } catch (error) {
    logger.error(`Failed to populate!`, { reason: error.message || error });
    process.exit(1);
  }
};

export default init;
