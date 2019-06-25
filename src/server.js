import config from './config';
import { TickSource, TickTarget, logger } from './helpers';
import { Subscription, Project, User, Entry, Task } from './models';
import { ProjectCtrl } from './controllers';

// TODO: add logger
const init = async () => {
  logger.info('Starting the app!');
  const { sourceLogin, sourcePassword, sourceUserAgent } = config.secrets;
  const { targetLogin, targetPassword, targetUserAgent } = config.secrets;

  const [err0, roles] = await TickSource.init(
    sourceLogin,
    sourcePassword,
    sourceUserAgent
  );
  if (err0) {
    logger.error(`Failed to init TickSource`, {
      reason: err0.message || err0
    });
  }

  Object.values(roles).forEach(({ subscription_id, company, api_token }) => {
    const role = { id: subscription_id, company, api_token };
    Subscription.create(role)
      .then(() => {
        logger.info(`Subscription ${role.company} created succesfully!`);
      })
      .catch(err => {
        logger.error('Failed to create subscr', { reason: err.message || err });
      });
  });

  const [err01, roles2] = await TickTarget.init(
    targetLogin,
    targetPassword,
    targetUserAgent
  );
  if (err01) {
    logger.error(`Failed to init TickTarget`, {
      reason: err01.message || err01
    });
  }

  const [err1, projects] = await TickSource.getAllProjects();
  if (err1) {
    logger.error(`Tatata`, { reason: err1.message || err1 });
  }

  Object.entries(projects).forEach(([subscription_id, projectsArr]) => {
    projectsArr.forEach(project => {
      ProjectCtrl.createProject(project, subscription_id)
        .then(() => {
          logger.info(`Project ${project.name} created succesfully!`);
        })
        .catch(err => {
          logger.error(`Failed to create project`, {
            reason: err.message || err
          });
        });
    });
  });

  const fromDate = '2019-06-01';

  const [err2, entries] = await TickSource.getAllEntries(fromDate);
  if (err2) {
    logger.error(`Failed to get source entries`, {
      reason: err2.message || err2
    });
  }

  entries.forEach(([subscription_id, entryKeyVal]) => {
    Object.entries(entryKeyVal).forEach(([proj_id, entries]) => {
      entries.forEach(entry => {
        Entry.create(entry)
          .then(() => {
            logger.info(`Entry ${entry.id} created succesfully!`);
          })
          .catch(err => {
            logger.error(`Failed to create entry ${entry.id}`, {
              reason: err.message || err
            });
          });
      });
    });
  });

  const [err3, users] = await TickSource.getAllUsers();
  if (err3) {
    logger.error('Failed to get source users', {
      reason: err3.message || err3
    });
  }

  Object.entries(users).forEach(([subscription_id, usersArr]) => {
    usersArr.forEach(user => {
      User.create({ ...user, subscription_id })
        .then(() => {
          logger.info(`User ${user.email} created succesfully!`);
        })
        .catch(err => {
          logger.error(`Failed to create user ${user.email}`, {
            reason: err.message || err
          });
        });
    });
  });

  const [err4, tasks] = await TickSource.getAllTasks();
  if (err4) {
    logger.error('Failed to get all tasks', {
      reason: err4.message || err4
    });
  }

  tasks.forEach(task => {
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

export default init;
