import config from './config';
import { TickSource, TickTarget } from './helpers';

// TODO: add logger
const init = async () => {
  const { sourceLogin, sourcePassword, sourceUserAgent } = config.secrets;
  const { targetLogin, targetPassword, targetUserAgent } = config.secrets;

  const [err0, roles] = await TickSource.init(
    sourceLogin,
    sourcePassword,
    sourceUserAgent
  );
  if (err0) console.error(`Wooo`, err0.message || err0);

  const [err01, roles2] = await TickTarget.init(
    targetLogin,
    targetPassword,
    targetUserAgent
  );
  if (err01) console.error(`Wooops`, err01.message || err01);

  console.log('---roles-source-available', roles);
  console.log('---roles-target-available', roles2);

  // TODO: should return [[subscription_id, { project_id: project }]]
  // TODO: currently it's { project_id: project }
  const [err1, projects] = await TickSource.getAllProjects();
  if (err1) console.error(`Tatata`, err1.message || err1);

  console.log('---projects-available', projects);

  const fromDate = '2019-06-01';

  const [err2, entries] = await TickSource.getAllEntries(fromDate);
  if (err2) console.error(`Atata`, err2.message || err2);

  const [err21, entries2] = await TickTarget.getAllEntries(fromDate);
  if (err21) console.error(`Goooosh`, err21.message || err21);

  // console.log('---entries', entries);

  entries.forEach(([, entryKeyVal]) => {
    Object.entries(entryKeyVal).forEach(([proj_id, entries]) => {
      console.log('---id', proj_id);
      entries.forEach(entry => {
        console.log('---entry-source', entry);
      });
    });
  });

  entries2.forEach(([, entryKeyVal]) => {
    Object.entries(entryKeyVal).forEach(([proj_id, entries]) => {
      console.log('---id', proj_id);
      entries.forEach(entry => {
        console.log('---entry-target', entry);
      });
    });
  });

  // TODO: should return [[subscription_id, { user_id: user }]
  // TODO: curently it's [{ user_id: user }]
  const [err3, users] = await TickSource.getAllUsers();
  if (err3) console.error('Naaah', err3.message || err3);

  console.log('---users', users);
};

export default init;
