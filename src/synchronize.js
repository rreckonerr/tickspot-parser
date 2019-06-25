import config from './config';
import { TickSource, TickTarget, logger } from './helpers';
import { ProjectCtrl, UserCtrl } from './controllers';

const initTickApi = async () => {
  const {
    sourceLogin,
    sourcePassword,
    sourceUserAgent
    // targetLogin,
    // targetPassword,
    // targetUserAgent
  } = config.secrets;

  // const [err0, sourceRole] = await TickSource.init(
  //   sourceLogin,
  //   sourcePassword,
  //   sourceUserAgent
  // );
  // try {
  //   if (err0) throw Error(`Failed to init Tick Source`, err0.message || err0);
  // } catch (error) {
  //   logger.error(`Exit code 1`, { reason: error.message || error });
  //   process.exit(1);
  // }

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
  const [err, allSourceProjects] = await fetchAllProjectsFromDb();
  if (err) process.exit(1);

  console.log('---projects', allSourceProjects);

  const testProject = {
    id: 1830355,
    name: 'Simply The Best',
    budget: 100,
    date_closed: null,
    notifications: false,
    billable: true,
    recurring: false,
    client_id: 374721,
    owner_id: 339348,
    url: 'http://secure.tickspot.com/126919/api/v2/projects/1830355.json',
    created_at: '2019-06-20T05:11:29.000-04:00',
    updated_at: '2019-06-20T05:30:31.000-04:00'
  };

  try {
    const [err, targetProject] = await TickTarget.createProject(testProject);
    if (err)
      throw new Error(
        `Failed to create project for target.`,
        err.message || err
      );

    console.log('Target project!', targetProject);
  } catch (error) {
    logger.error(`Failed to synchronize project ${testProject.id}`, {
      reason: error.message || error
    });
  }

  allSourceProjects.forEach(async project => {
    try {
      const [err1, targetProject] = await TickTarget.createProject(project);
      if (err1)
        throw new Error(
          `Failed to create project for target.`,
          err1.message || err1
        );

      const [
        err2,
        newSourceProject
      ] = await ProjectCtrl.updateWithTargetProject(project.id, targetProject);
      if (err2)
        throw new Error(
          `Failed to update source project in db.`,
          err2.message || err2
        );
    } catch (error) {
      logger.error(`Failed to synchronize project ${project.id}`, {
        reason: error.message || error
      });
      return;
    }

    console.log('---from-db', project);
  });
};

const fetchAllUsersFromDb = async () => {
  try {
    const users = await UserCtrl.fetchAllUsers();

    return [null, users];
  } catch (error) {
    logger.error(`Failed to fetch users from db`, {
      reason: error.message || error
    });
    return [error];
  }
};

const synchronizeUsers = async () => {
  try {
    const [err, sourceUsersRaw] = await fetchAllUsersFromDb();
    if (err) process.exit(1);

    const sourceUsers = sourceUsersRaw.map(user => user.get({ plain: true }));

    console.log('--source-users', sourceUsers);
    const targetUsers = [];
    for await (const targetUser of createTargetUsers(sourceUsers)) {
      if (targetUser) targetUsers.push(targetUser);
    }

    console.log('---target-users', targetUsers);
    return [null, targetUsers];
  } catch (error) {
    logger.error(`Failed to synchronize users.`, {
      reason: error || error.message
    });
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

      const [err, newUser] = await TickTarget.createUser(userToCreate);
      if (err) throw Error(err.message || error);

      yield newUser;
    } catch (error) {
      logger.error(`Failed to create target user for ${arr[i].email}`, {
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
    await synchronizeUsers();
    // await synchronizeProjects();
  } catch (error) {
    logger.error(`Failed to synchronize`, { reason: error.message || error });
  }
};

export default init;
