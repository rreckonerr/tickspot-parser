import config from './config';
import { TickSource, logger } from './helpers';
import {
  ProjectCtrl,
  UserCtrl,
  ClientCtrl,
  TaskCtrl,
  EntryCtrl,
  SubscriptionCtrl
} from './controllers';

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

    if (dbProjects.length) {
      logger.info(
        `Successfully added ${dbProjects.length} of ${sourceProjects.length} projects to the db.`
      );
    }

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

    if (dbUsers.length) {
      logger.info(
        `Successfully added ${dbUsers.length} of ${sourceUsers.length} users to the db.`
      );
    }

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

    if (dbClients.length) {
      logger.info(
        `Successfully added ${dbClients.length} of ${sourceClients.length} clients to the db.`
      );
    }

    return dbClients;
  } catch (error) {
    logger.error(`Failed to populate clients table`, {
      reason: error.message || error
    });
    // process.exit(1);
  }
};

const populateTasks = async () => {
  try {
    const [err, sourceTasks] = await TickSource.getAllTasks();
    if (err) {
      throw Error(
        `Failed to get all tasks for the source. ` + err.message || err
      );
    }

    const [err1, dbTasks] = await TaskCtrl.createTasks(sourceTasks);
    if (err1) {
      throw Error(`Failed to add tasks to the db. `, err1.message || err1);
    }

    if (dbTasks.length) {
      logger.info(
        `Successfully added ${dbTasks.length} of ${sourceTasks.length} tasks to the db.`
      );
    }

    return dbTasks;
  } catch (error) {
    logger.error(`Failed to populate the tasks table`, {
      reason: error.message || error
    });
    // process.exit(1);
  }
};

const populateEntries = async () => {
  try {
    // TODO: ask user for the date or interval
    const fromDate = '2019-06-01';

    const [err, sourceEntries] = await TickSource.getAllEntries(fromDate);
    if (err) {
      throw Error(
        `Failed to get all entries for the source. ` + err.message || err
      );
    }

    const [err1, dbEntries] = await EntryCtrl.createEntries(sourceEntries);
    if (err1) {
      throw Error(`Failed to add entries to the db. `, err1.message || err1);
    }

    if (dbEntries.length) {
      logger.info(
        `Successfully added ${dbEntries.length} of ${sourceEntries.length} entries to the db.`
      );
    }

    return dbEntries;
  } catch (error) {
    logger.error(`Failed to populate the entries table`, {
      reason: error.message || error
    });
    // process.exit(1);
  }
};

const init = async () => {
  try {
    const subscription_id = await populateSubscriptions();
    const dbClients = await populateClients(subscription_id);
    const dbUsers = await populateUsers(subscription_id);
    const dbProjects = await populateProjects(subscription_id);
    const dbTasks = await populateTasks();
    const dbEntries = await populateEntries();

    console.log('dbClients', !!dbClients.length);
    console.log('dbUsers', !!dbUsers.length);
    console.log('dbProjects', !!dbProjects.length);
    console.log('dbTasks', !!dbTasks.length);
    console.log('dbEntries', !!dbEntries.length);
  } catch (error) {
    logger.error(`Failed to populate!`, { reason: error.message || error });
    process.exit(1);
  }
};

export default init;
