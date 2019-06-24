import config from './config';
import { TickSource, TickTarget, logger } from './helpers';
import { Subscription, Project, User } from './models';

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
    console.log('--one-of-roles', role);
    Subscription.create(role)
      .then(() => {
        logger.info(`Subscription ${role.company} created succesfully!`);
      })
      .catch(err => {
        logger.error('Failed to create subscr', { reason: err.message || err });
      });
  });

  // const rolesExample = { '126919':
  //  { subscription_id: 126919,
  //    company: 'Some Inc.',
  //    api_token: '5cdbec7bb9e3d2449696b565d157d248' } };

  // const roleStruct = {
  //   subscription_id: 126919,
  //   company: 'Some Inc.',
  //   api_token: '5cdbec7bb9e3d2449696b565d157d248'
  // };

  // console.log('---roles', roles);

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

  // console.log('---roles-source-available', roles);
  // console.log('---roles-target-available', roles2);

  // TODO: should return [[subscription_id, { project_id: project }]]
  // TODO: currently it's { project_id: project }
  const [err1, projects] = await TickSource.getAllProjects();
  if (err1) {
    logger.error(`Tatata`, { reason: err1.message || err1 });
  }

  // const projectsExample = {
  //   '126919': [
  //     {
  //       id: 1830355,
  //       name: 'Simply The Best',
  //       budget: 100,
  //       date_closed: null,
  //       notifications: false,
  //       billable: true,
  //       recurring: false,
  //       client_id: 374721,
  //       owner_id: 339348,
  //       url: 'http://secure.tickspot.com/126919/api/v2/projects/1830355.json',
  //       created_at: '2019-06-20T05:11:29.000-04:00',
  //       updated_at: '2019-06-20T05:30:31.000-04:00'
  //     }
  //   ]
  // };

  // const projectStruct = {
  //   id: 1830355,
  //   name: 'Simply The Best',
  //   budget: 100,
  //   date_closed: null,
  //   notifications: false,
  //   billable: true,
  //   recurring: false,
  //   client_id: 374721,
  //   owner_id: 339348,
  //   url: 'http://secure.tickspot.com/126919/api/v2/projects/1830355.json',
  //   created_at: '2019-06-20T05:11:29.000-04:00',
  //   updated_at: '2019-06-20T05:30:31.000-04:00'
  // };

  Object.entries(projects).forEach(([subscription_id, projectsArr]) => {
    projectsArr.forEach(project => {
      // console.log('---project', project);
      Project.create({ ...project, subscription_id })
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

  // console.log('---projects-available', projects);

  const fromDate = '2019-06-01';

  const [err2, entries] = await TickSource.getAllEntries(fromDate);
  if (err2) {
    logger.error(`Failed to get source entries`, {
      reason: err2.message || err2
    });
  }

  // const [err21, entries2] = await TickTarget.getAllEntries(fromDate);
  // if (err21) {
  //   logger.error(`Failed to get target entries`, {
  //     reason: err21.message || err21
  //   });
  // }

  console.log('---entries', entries);

  entries.forEach(([subscription_id, entryKeyVal]) => {
    Object.entries(entryKeyVal).forEach(([proj_id, entries]) => {
      console.log('---entries', entries);
      entries.forEach(entry => {
        // console.log('---entry-source', entry);
      });
    });
  });

  // entries2.forEach(([, entryKeyVal]) => {
  //   Object.entries(entryKeyVal).forEach(([proj_id, entries]) => {
  //     // console.log('---id', proj_id);
  //     entries.forEach(entry => {
  //       // console.log('---entry-target', entry);
  //     });
  //   });
  // });

  // TODO: should return [[subscription_id, { user_id: user }]
  // TODO: curently it's [{ user_id: user }]
  const [err3, users] = await TickSource.getAllUsers();
  if (err3) {
    logger.error('Failed to get source users', {
      reason: err3.message || err3
    });
  }

  // const usersExample = {
  //   '339348': {
  //     id: 339348,
  //     first_name: 'Volodymyr',
  //     last_name: 'Radchenko',
  //     email: 'bratko_bob@yahoo.com',
  //     timezone: 'Eastern Time (US & Canada)',
  //     created_at: '2019-06-20T05:08:29.000-04:00',
  //     updated_at: '2019-06-20T05:09:26.000-04:00',
  //     billable_rate: null
  //   },
  //   '339349': {
  //     id: 339349,
  //     first_name: 'Test 1',
  //     last_name: 'Test 1',
  //     email: 'rreckonerr@gmail.com',
  //     timezone: 'Eastern Time (US & Canada)',
  //     created_at: '2019-06-20T05:13:17.000-04:00',
  //     updated_at: '2019-06-20T05:17:31.000-04:00',
  //     billable_rate: null
  //   },
  //   '339350': {
  //     id: 339350,
  //     first_name: 'Test 2 ',
  //     last_name: 'Test 2',
  //     email: 'snowman.legalise@gmail.com',
  //     timezone: 'Eastern Time (US & Canada)',
  //     created_at: '2019-06-20T05:16:39.000-04:00',
  //     updated_at: '2019-06-20T05:17:17.000-04:00',
  //     billable_rate: null
  //   },
  //   '339351': {
  //     id: 339351,
  //     first_name: 'random dude',
  //     last_name: 'dude',
  //     email: 'random@dude.com',
  //     timezone: 'Eastern Time (US & Canada)',
  //     created_at: '2019-06-20T05:29:52.000-04:00',
  //     updated_at: '2019-06-20T05:29:52.000-04:00',
  //     billable_rate: null
  //   }
  // };

  // const userStruct = {
  //   id: 339349,
  //   first_name: 'Test 1',
  //   last_name: 'Test 1',
  //   email: 'rreckonerr@gmail.com',
  //   timezone: 'Eastern Time (US & Canada)',
  //   created_at: '2019-06-20T05:13:17.000-04:00',
  //   updated_at: '2019-06-20T05:17:31.000-04:00',
  //   billable_rate: null
  // };

  // console.log('---users', users);

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
};

export default init;
