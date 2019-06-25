import populate from './populate';
import postRequests from './post-requests';
import synchronize from './synchronize';
import { logger } from './helpers';
import prompts from 'prompts';

logger.verbose('Starting the app.');

const askUserForAction = async () => {
  const choices = [
    { title: 'Populate the database', value: 'populate' },
    { title: 'Synchronize the data', value: 'synchronize' }
  ];

  const { selected } = await prompts(
    {
      type: 'select',
      name: 'selected',
      message: `What would you like to do?`,
      choices
    },
    { onCancel: () => process.exit(1) }
  );
  return selected;
};

const handler = async () => {
  const userAction = await askUserForAction();
  // const userAction = await Promise.resolve('synchronize');

  switch (userAction) {
    case 'populate':
      populate();
      break;
    case 'synchronize':
      synchronize();
    default:
      break;
  }
};

handler();
