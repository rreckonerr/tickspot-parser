import config from './config';
import { TickSource } from './helpers';

// TODO: add logger
const init = async () => {
  const { sourceLogin, sourcePassword, sourceUserAgent } = config.secrets;

  const [err0, roles] = await TickSource.init(
    sourceLogin,
    sourcePassword,
    sourceUserAgent
  );
  if (err0) console.error(`Wooo`, err0.message || err0);

  console.log('---roles-available', roles);

  const [err1, projects] = await TickSource.getAllProjects();
  if (err1) console.error(`Tatata`, err1.message || err1);

  console.log('---projects-available', projects);

  const fromDate = '2019-06-01';

  const [err2, entries] = await TickSource.getAllEntries(fromDate);
  if (err2) console.error(`Atata`, err2.message || err2);

  // console.log('---entries', entries);

  entries.forEach(([, entryKeyVal]) => {
    Object.entries(entryKeyVal).forEach(([proj_id, entries]) => {
      console.log('---id', proj_id);
      entries.forEach(entry => {
        console.log('---entry', entry);
      });
    });
  });
};

export default init;
