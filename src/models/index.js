import * as Sequelize from 'sequelize';
import config from '../config';

import Subscription from './subscription';
import Project from './project';

const { database, username, password, host, dialect, port } = config.db;

const sequelize = new Sequelize.Sequelize(database, username, password, {
  host,
  dialect,
  port: parseInt(port, 10)
});

const models = {
  Subscription: Subscription.init(sequelize, Sequelize),
  Project: Project.init(sequelize, Sequelize)
};

console.log('---models', models);
Object.keys(models).forEach(key => {
  console.log('---keys', key);
  if ('assosiate' in models[key]) {
    models[key].assosiate(models);
  }
});

export { Subscription, Project };
