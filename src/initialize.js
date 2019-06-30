import fs from 'fs';
import { TickSource, TickTarget, logger } from './helpers';
import config from './config';
import { SubscriptionCtrl } from './controllers';
import { reject, resolve } from 'any-promise';

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

async function* writeUsersToFile(fileName, users) {
  try {
    let i = 0;
    while (i < users.length) {
      const user = users[i];
      try {
        const userEmail = await writeUserToFile(fileName, user);

        yield [null, userEmail];
      } catch (error) {
        yield [error, user.email];
      } finally {
        i++;
      }
    }
  } catch (error) {
    logger.error(`Failed to write users to a file`, {
      reason: error.message || error
    });
    throw Error(error);
  }
}

const writeUserToFile = (fileName, user) => {
  return new Promise((resolve, reject) => {
    if (!user) reject(new Error(`No user data provided`));

    const { id, first_name, last_name, email } = user;

    if (!id || !email) reject(new Error(`User id and email are required`));

    const lineToAdd = `${id} | ${email} | ${first_name} | ${last_name}\n`;

    fs.appendFile(fileName, lineToAdd, err => {
      if (err) reject(new Error(err));
      resolve(email);
    });
  });
};

const writeSourceUsersToFile = async () => {
  try {
    const [err, sourceUsers] = await TickSource.getAllUsers();
    if (err) {
      logger.error(`Failed to get all users`, { reason: err.message || err });
      throw Error(error);
    }

    const fileName = 'source-users.txt';

    for await (const [err, userEmail] of writeUsersToFile(
      fileName,
      sourceUsers
    )) {
      if (err) {
        logger.error(`Failed to write source user ${userEmail} to file`, {
          reason: err.message || err
        });
      } else {
        logger.info(
          `Source user ${userEmail} successfully added to "${fileName}"`
        );
      }
    }
  } catch (error) {
    logger.error(`Failed to write source users to a file`, {
      reason: error.message || error
    });
    console.error(error);
    process.exit(1);
  }
};

const initialize = async () => {
  try {
    await linkSubscriptions();

    await writeSourceUsersToFile();
  } catch (error) {
    logger.error(`Failed to initialize app.`, {
      reason: error.message || error
    });
    process.exit(1);
  }
};

export default initialize;
