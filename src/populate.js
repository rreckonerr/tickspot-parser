import config from './config';
import { TickSource, logger } from './helpers';
import { Subscription, Project, User, Entry, Task, Client } from './models';
import {
  ProjectCtrl,
  UserCtrl,
  ClientCtrl,
  TaskCtrl,
  EntryCtrl,
  SubscriptionCtrl
} from './controllers';

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

const populateSubscriptions = async () => {
  try {
    const { sourceLogin, sourcePassword, sourceUserAgent } = config.secrets;
    const [err, sourceRole] = await TickSource.init(
      sourceLogin,
      sourcePassword,
      sourceUserAgent
    );
    if (err) {
      logger.error(`Failed to init TickSource`, {
        reason: err.message || err
      });
      throw new Error(err.message || err);
    }

    const { subscription_id, company, api_token } = sourceRole;
    const dbRole = { id: subscription_id, company, api_token };

    // console.log('---sourceRole', sourceRole);
    const [err1, dbSubscription] = await SubscriptionCtrl.createSubscription(
      dbRole
    );
    if (err1) {
      logger.error(`Failed to save subscription to db`, {
        reason: err1.message || err1
      });
      throw new Error(err1.message || err1);
    }

    logger.info(
      `Successfully added ${dbSubscription.company} subscription to the db.`
    );

    return subscription_id;
  } catch (error) {
    logger.error(`Failed to populate subscriptions table.`, {
      reason: error.message || error
    });
    return TickSource.getSubscriptionId();
    // process.exit(1);
  }
};

const populateProjects = async subscription_id => {
  try {
    if (!subscription_id) throw Error(`Must provide subscription_id`);

    const [err, sourceProjects] = await TickSource.getAllProjects();
    if (err) {
      logger.error(`Failed to get all projects for source`, {
        reason: err.message || err
      });
      throw new Error(err.message || err);
    }

    const [err1, dbProjects] = await ProjectCtrl.createProjects(
      sourceProjects,
      subscription_id
    );
    if (err1) throw Error(err1.message || err1);

    logger.info(
      `Successfully added ${dbProjects.length} of ${sourceProjects.length} projects to the db.`
    );

    return dbProjects;
  } catch (error) {
    logger.error(`Failed to populate projects table.`, {
      reason: error.message || error
    });
    // process.exit(1);
  }
};

const populateUsers = async subscription_id => {
  try {
    if (!subscription_id) throw Error(`Must provide subscription_id.`);

    const [err, sourceUsers] = await TickSource.getAllUsers();
    if (err) {
      throw Error(
        `Failed to get all users for the source. ` + err.message || err
      );
    }

    const [err1, dbUsers] = await UserCtrl.createUsers(
      sourceUsers,
      subscription_id
    );
    if (err1) {
      throw Error(`Failed to add users to the db. ` + err1.message || err1);
    }

    logger.info(
      `Successfully added ${dbUsers.length} of ${sourceUsers.length} users to the db.`
    );

    return dbUsers;
  } catch (error) {
    logger.error(`Failed to populate users table.`, {
      reason: error.message || error
    });
    // process.exit(1);
  }
};

const populateClients = async subscription_id => {
  try {
    if (!subscription_id) throw Error(`Must provide subscription_id`);

    const [err, sourceClients] = await TickSource.getAllClients();
    if (err) {
      throw Error(
        `Failed to get all clients for the source. ` + err.message || err
      );
    }

    const [err1, dbClients] = await ClientCtrl.createClients(
      sourceClients,
      subscription_id
    );
    if (err1) {
      throw Error(`Failed to add clients to the db. `, err1.message || err1);
    }

    logger.info(
      `Successfully added ${dbClients.length} of ${sourceClients.length} clients to the db.`
    );

    return dbClients;
  } catch (error) {
    logger.error(`Failed to populate clients table`, {
      reason: error.message || error
    });
    // process.exit(1);
  }
};

const init = async () => {
  try {
    const subscription_id = await populateSubscriptions();
    const dbClients = await populateClients(subscription_id);
    // const dbUsers = await populateUsers(subscription_id);

    // const dbProjects = await populateProjects(subscription_id);
    // const fromDate = '2019-06-01';

    // const [err2, entries] = await TickSource.getAllEntries(fromDate);
    // if (err2) {
    //   logger.error(`Failed to get source entries`, {
    //     reason: err2.message || err2
    //   });
    // }

    // // console.log('---entries', entries);
    // await saveEntriesToDb(entries);

    // const [err3, users] = await TickSource.getAllUsers();
    // if (err3) {
    //   logger.error('Failed to get source users', {
    //     reason: err3.message || err3
    //   });
    // }

    // // console.log('---users', users);
    // await saveUsersToDb(users, subscription_id);

    // const [err4, tasks] = await TickSource.getAllTasks();
    // if (err4) {
    //   logger.error('Failed to get all tasks', {
    //     reason: err4.message || err4
    //   });
    // }

    // // console.log('---tasks', tasks);
    // await saveTasksToDb(tasks);

    // const [err5, clients] = await TickSource.getAllClients();
    // if (err5) {
    //   logger.error(`Failed to get clients`, { reason: err5.message || err5 });
    // }
    // // console.log('---clients', clients);
    // await saveClientsToDb(clients);
  } catch (error) {
    logger.error(`Failed to populate!`, { reason: error.message || error });
    process.exit(1);
  }
};

export default init;
