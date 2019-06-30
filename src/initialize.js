import { TickSource, TickTarget, logger, FileSystem } from './helpers';
import config from './config';
import { SubscriptionCtrl } from './controllers';

const getSourceRole = async () => {
  try {
    const { sourceLogin, sourcePassword, sourceUserAgent } = config.secrets;
    const [err, sourceRole] = await TickSource.init(
      sourceLogin,
      sourcePassword,
      sourceUserAgent
    );
    if (err) throw Error(err.message || err);

    return sourceRole;
  } catch (error) {
    throw Error('Failed to init Tick Source. ' + error.message || error);
  }
};

const getTargetRole = async () => {
  try {
    const { targetLogin, targetPassword, targetUserAgent } = config.secrets;
    const [err, targetRole] = await TickTarget.init(
      targetLogin,
      targetPassword,
      targetUserAgent
    );
    if (err) throw Error(err.message || err);

    return targetRole;
  } catch (error) {
    throw Error('Failed to init Tick Target. ' + error.message || error);
  }
};

const linkSubscriptions = async () => {
  try {
    const sourceRole = await getSourceRole();
    const targetRole = await getTargetRole();

    const { subscription_id: id, company, api_token } = sourceRole;
    const { subscription_id: target_id } = targetRole;

    const [err, sourceDbRole] = await SubscriptionCtrl.createSubscription({
      id,
      target_id,
      company,
      api_token
    });

    if (err) throw Error(`Failed to write role to the db`, err.message || err);

    console.log('---created-role', sourceDbRole);
  } catch (error) {
    logger.error(`Failed to link subscriptions.`, {
      reason: error.message || error
    });
  }
};

const createUserFiles = async () => {
  try {
    const [err, sourceUsers] = await TickSource.getAllUsers();
    if (err) {
      logger.error(`Failed to get all source users`, {
        reason: err.message || err
      });
      throw Error(error);
    }

    const [err2, targetUsers] = await TickTarget.getAllUsers();
    if (err2) {
      logger.error(`Failed to get all target users`, {
        reason: err.message || err
      });
      throw Error(error);
    }

    const sourceFileName = `source-users.txt`;
    const targetFileName = `target-users.txt`;

    await FileSystem.writeUsersToFile(sourceFileName, sourceUsers);
    await FileSystem.writeUsersToFile(targetFileName, targetUsers);
  } catch (error) {
    logger.error(`Failed to create files for users`, {
      reason: error.message || error
    });
    console.error(error);
    process.exit(1);
  }
};

const linkUsers = async () => {
  try {
    const fileName = `link-users.txt`;
    // TODO: add prompts to askUserToLinkEmails;

    const [err, sourceUsers] = await TickSource.getAllUsers();
    if (err) {
      logger.error(`Failed to get all source users`, {
        reason: err.message || err
      });
      throw Error(error);
    }

    // const [err2, linkedUsers] = await

    // fs.readFile(filename, (err, data) => {
    // data.split('=>').forEach(([targetId, sourceId]) => {
    //   TickSource.createUser()
    // })
    // })
  } catch (error) {
    logger.error(`Failed to link users`, {
      reason: error.message || error
    });
    console.error(error);
    process.exit(1);
  }
};

const initialize = async () => {
  try {
    await linkSubscriptions();

    await createUserFiles();

    await linkUsers();
  } catch (error) {
    logger.error(`Failed to initialize app.`, {
      reason: error.message || error
    });
    process.exit(1);
  }
};

export default initialize;
