import * as Sequelize from 'sequelize';
import config from '../config';

import Subscription from './subscription';
import Project from './project';
import User from './user';
import Entry from './entry';
import Task from './task';
import Client from './client';

const {
  database,
  username,
  password,
  host,
  dialect,
  port,
  logging
} = config.db;

const sequelize = new Sequelize.Sequelize(database, username, password, {
  host,
  dialect,
  logging,
  port: parseInt(port, 10)
});

const models = {
  Subscription: Subscription.init(sequelize, Sequelize),
  Project: Project.init(sequelize, Sequelize),
  User: User.init(sequelize, Sequelize),
  Entry: Entry.init(sequelize, Sequelize),
  Task: Task.init(sequelize, Sequelize),
  Client: Client.init(sequelize, Sequelize)
};

Object.keys(models).forEach(key => {
  if ('assosiate' in models[key]) {
    models[key].assosiate(models);
  }
});

export { Subscription, Project, User, Entry, Task, Client };
