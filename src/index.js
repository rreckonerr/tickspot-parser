import initialize from './initialize';
import populate from './populate';
import synchronize from './synchronize';
import { logger } from './helpers';
import prompts from 'prompts';

logger.verbose('Starting the app.');

const askUserForAction = async () => {
  const choices = [
    { title: 'First start', value: 'initialize' },
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

  switch (userAction) {
    case 'initialize':
      // *set init source-target relations for subscription
      // *create files for user assosiation
      initialize();
      break;
    case 'populate':
      populate();
      break;
    case 'synchronize':
      synchronize();
      break;
    default:
      process.exit(1);
      break;
  }
};

handler();
