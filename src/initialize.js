import { TickSource, TickTarget, logger, FileSystem } from './helpers';
import config from './config';
import { SubscriptionCtrl, UserCtrl } from './controllers';

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

const writeUsersToFile = async (fileName, users) => {
  try {
    await FileSystem.removeFile(fileName);

    const linesToWrite = users.map(user => {
      if (!user) throw Error(`No user data provided`);

      const { id, first_name, last_name, email } = user;
      if (!id || !email) throw Error(`User id and email are required`);

      const lineToAdd = `${id} | ${email} | ${first_name} | ${last_name}\n`;

      return lineToAdd;
    });

    return await FileSystem.writeLinesToFile(fileName, linesToWrite);
  } catch (error) {
    logger.error(`Failed to write users to ${fileName}`, {
      reason: error.message || error
    });
    throw Error(error);
  }
};

const createLinkedUsersFile = async (fileName, sourceUsers) => {
  try {
    // await FileSystem.removeFile(fileName);

    const linesToAdd = sourceUsers.map(({ id }) => `${id}=>\n`);

    await FileSystem.writeLinesToFile(fileName, linesToAdd);
  } catch (error) {
    logger.error(`Failed to create file for linking users`, {
      reason: error.message || error
    });
    throw Error(error);
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

    await writeUsersToFile(sourceFileName, sourceUsers);
    await writeUsersToFile(targetFileName, targetUsers);

    const linkedFileName = `link-users.txt`;
    const linkedFileExists = await FileSystem.exists(linkedFileName);

    if (!linkedFileExists) {
      await createLinkedUsersFile(linkedFileName, sourceUsers);
    }
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
    // TODO: add prompts to askUserToLinkEmails;

    const [err, sourceUsers] = await TickSource.getAllUsers();
    if (err) {
      logger.error(`Failed to get all source users`, {
        reason: err.message || err
      });
      throw Error(err);
    }

    const [err2, linkedUsers] = await FileSystem.getLinkedUsers();
    if (err2) {
      logger.error(`Failed to get all linked users`, {
        reason: err2.message || err2
      });
      throw Error(err2);
    }

    console.log('---linked-users', linkedUsers);

    const linkedSourceUsers = sourceUsers.map(user => {
      return {
        ...user,
        target_id: +linkedUsers[user.id]
      };
    });

    console.log('---linked-source-users', linkedSourceUsers);

    // const subscription_id = TickSource.getSubscriptionId();

    // const [err1, dbUsers] = await UserCtrl.createUsers(
    //   linkedSourceUsers,
    //   subscription_id
    // );
    // if (err1) {
    //   logger.error(`Failed to add linked source users to DB`);
    //   throw Error(err1);
    // }
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
