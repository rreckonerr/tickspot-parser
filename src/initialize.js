import { TickSource, TickTarget, logger } from './helpers';
import config from './config';

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
  const sourceRole = await getSourceRole();
  const targetRole = await getTargetRole();
};

const initialize = async () => {
  try {
    await linkSubscriptions();
  } catch (error) {
    logger.error(`Failed to initialize app.`, {
      reason: error.message || error
    });
    process.exit(1);
  }
};

export default initialize;
