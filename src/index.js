import populate from './populate';
import postRequests from './post-requests';
import { logger } from './helpers';
import prompts from 'prompts';

logger.verbose('Starting the app.');

// postRequests();
// server();
const askUserForAction = async () => {
  const choices = [
    { title: 'Populate the database', value: 'populate' },
    { title: 'Synchronize the data', value: 'populate' }
  ];

  const { selected } = await prompts({
    type: 'select',
    name: 'selected',
    message: `What would you like to do?`,
    choices
  });
  return selected;
};

const handler = async () => {
  const userAction = await askUserForAction();

  switch (userAction) {
    case 'populate':
      //   server();
      populate();
      break;
    case 'synchronize':
      postRequests();
    // synchronize();
    default:
      break;
  }
};

handler();
