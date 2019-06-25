import config from './config';
import { TickSource, TickTarget, logger } from './helpers';
import { ProjectCtrl } from './controllers';

const postRequests = async () => {
  logger.info('Starting the app!');

  // ========================================================================
  // INIT
  // ========================================================================

  const {
    sourceLogin,
    sourcePassword,
    sourceUserAgent,
    targetLogin,
    targetPassword,
    targetUserAgent
  } = config.secrets;

  const [err0, sourceRoles] = await TickSource.init(
    sourceLogin,
    sourcePassword,
    sourceUserAgent
  );
  if (err0) {
    logger.error(`Failed to init TickSource`, {
      reason: err0.message || err0
    });
  }

  console.log('---source-roles', sourceRoles);

  const [err1, targetRoles] = await TickTarget.init(
    targetLogin,
    targetPassword,
    targetUserAgent
  );
  if (err1) {
    logger.error(`Failed to init TickTarget`, {
      reason: err01.message || err1
    });
  }

  console.log('---target-roles', targetRoles);

  // ========================================================================
  // PROJECTS
  // ========================================================================

  const [err2, sourceProjects] = await TickSource.getAllProjects();
  if (err1) {
    logger.error(`Failed to get all projects for source`, {
      reason: err2.message || err2
    });
  }

  console.log('---source-projects', sourceProjects);

  const [err3, targetProjects] = await TickTarget.getAllProjects();
  if (err3) {
    logger.error(`Failed to get all projects for target`, {
      reason: err3.message || err3
    });
  }

  console.log('---target-projects', targetProjects);

  // ========================================================================
  // ENTRIES
  // ========================================================================

  const fromDate = '2019-06-01';

  const [err4, sourceEntries] = await TickSource.getAllEntries(fromDate);
  if (err4) {
    logger.error(`Failed to get source entries`, {
      reason: err4.message || err4
    });
  }
  console.log('---source-entries', sourceEntries);

  const [err5, targetEntries] = await TickTarget.getAllEntries(fromDate);
  if (err5) {
    logger.error(`Failed to get target entries`, {
      reason: err5.message || err5
    });
  }
  console.log('---target-entries', targetEntries);

  // ========================================================================
  // USERS
  // ========================================================================

  const [err6, sourceUsers] = await TickSource.getAllUsers();
  if (err6) {
    logger.error('Failed to get source users', {
      reason: err6.message || err6
    });
  }

  console.log('---source-users', sourceUsers);

  const [err7, targetUsers] = await TickTarget.getAllUsers();
  if (err7) {
    logger.error('Failed to get source users', {
      reason: err7.message || err7
    });
  }

  console.log('---target-users', targetUsers);

  // ========================================================================
  // PROJECT CONTROLLER
  // ========================================================================

  const allSourceProjects = await ProjectCtrl.fetchAllProjects();
  console.log('proj-ctrl', allSourceProjects);
  allSourceProjects.forEach(project => {
    // TickTarget.createProject(project)
    //   .then(targetProject => {
    //     ProjectCtrl.updateWithTargetProject(project.id, targetProject)
    //       .then(() => {
    //         logger.info(`Synched ${project.name}!`);
    //       })
    //       .catch(err => {
    //         logger.error(
    //           `Failed to synch ${project.name}:${project.id}`,
    //           { reason: err.message || err}
    //         );
    //       });
    //   })
    //   .catch(err => {
    //     logger.error(
    //       `Failed to create target project from ${project.name}`,
    //       { reason: err.message || err}
    //     );
    //   });
  });
};

export default postRequests;
