import config from './config';
import { TickSource, TickTarget, logger } from './helpers';
import { ProjectCtrl } from './controllers';

const initTickApi = async () => {
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
  try {
    if (err0) throw Error(`Failed to init Tick Source`, err0.message || err0);
  } catch (error) {
    logger.error(`Exit code 1`, { reason: error.message || error });
    process.exit(1);
  }

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

  return [sourceRole, targetRole];
};

const synchronizeProjects = async () => {
  const allSourceProjects = [];
  try {
    const projects = await ProjectCtrl.fetchAllProjects();

    allSourceProjects.push(...projects);
  } catch (error) {
    logger.error(`Failed to fetch projects from db`, {
      reason: error.message || error
    });
    process.exit(1);
  }

  console.log('---projects', allSourceProjects);
  const testProject = {
    id: '0000001',
    name: 'Test Project',
    budget: null,
    date_closed: null,
    notifications: false,
    billable: true,
    recurring: false,
    client_id: 363380,
    subscription_id: 0,
    owner_id: 311691,
    url: 'http://secure.tickspot.com/110437/api/v2/projects/1772061.json',
    created_at: '2019-02-08T11:29:39.000Z',
    updated_at: '2019-06-25T09:23:21.000Z',
    subscriptionId: 0
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

  //   allSourceProjects.forEach(async project => {
  //     try {
  //       const [err, targetProject] = await TickTarget.createProject(project);
  //       if (err)
  //         throw new Error(
  //           `Failed to create project for target.`,
  //           err.message || err
  //         );

  //       const [
  //         err1,
  //         newSourceProject
  //       ] = await ProjectCtrl.updateWithTargetProject(project.id, targetProject);
  //       if (err1)
  //         throw new Error(
  //           `Failed to update source project in db.`,
  //           err1.message || err1
  //         );
  //     } catch (error) {
  //       logger.error(`Failed to synchronize project ${project.id}`, {
  //         reason: error.message || error
  //       });
  //       return;
  //     }

  //     console.log('---from-db', project);
  //   });
};

const init = async () => {
  try {
    await initTickApi();
    await synchronizeProjects();
  } catch (error) {
    logger.error(`Failed to synchronize`, { reason: error.message || error });
  }
};

export default init;
