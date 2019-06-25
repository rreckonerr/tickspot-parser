import server from './server';
import postRequests from './post-requests';
import { logger } from './helpers';

logger.verbose('Starting the app.');

postRequests();
// server();
