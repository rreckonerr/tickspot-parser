import config from './config';
import { TickSource, TickTarget, logger } from './helpers';
import { Subscription, Project, User, Entry, Task, Client } from './models';
import { ProjectCtrl } from './controllers';

const init = async () => {
  logger.info('Starting the app!');
  const {
    sourceLogin,
    sourcePassword,
    sourceUserAgent,
    targetLogin,
    targetPassword,
    targetUserAgent
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

  const [err1, clients] = await TickSource.getAllClients();
  if (err1) {
    logger.error(`Failed to get clients`, { reason: err1.message || err1 });
  }

  console.log('---clients', clients);
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

const saveUsersToDb = async users => {
  return await users.forEach(async user => {
    await User.create({ ...user, subscription_id: sourceRole.subscription_id })
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

const initIdle = async () => {
  try {
    logger.info('Starting the app!');
    const {
      sourceLogin,
      sourcePassword,
      sourceUserAgent,
      targetLogin,
      targetPassword,
      targetUserAgent
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

    Subscription.create(dbRole)
      .then(() => {
        logger.info(`Subscription ${sourceRole.company} created succesfully!`);
      })
      .catch(err => {
        logger.error('Failed to create subscr', {
          reason: err.message || err
        });
      });

    const [err01, targetRole] = await TickTarget.init(
      targetLogin,
      targetPassword,
      targetUserAgent
    );
    if (err01) {
      logger.error(`Failed to init TickTarget`, {
        reason: err01.message || err01
      });
    }

    const fromDate = '2019-06-01';

    const [err2, entries] = await TickSource.getAllEntries(fromDate);
    if (err2) {
      logger.error(`Failed to get source entries`, {
        reason: err2.message || err2
      });
    }

    await saveEntriesToDb(entries);

    const [err3, users] = await TickSource.getAllUsers();
    if (err3) {
      logger.error('Failed to get source users', {
        reason: err3.message || err3
      });
    }

    await saveUsersToDb(users);

    const [err4, tasks] = await TickSource.getAllTasks();
    if (err4) {
      logger.error('Failed to get all tasks', {
        reason: err4.message || err4
      });
    }

    await saveTasksToDb(tasks);
  } catch (error) {
    logger.error(`Failed to populate!`, { reason: error.message || error });
    process.exit(1);
  }
};

export default init;
