import { merge } from 'lodash';
import dotenv from 'dotenv';

dotenv.config();

const env = process.env.NODE_ENV || 'development';

const baseConfig = {
  env,
  isDev: env === 'development',
  isTest: env === 'testing',
  port: 3000,
  secrets: {
    sourceLogin: '',
    sourcePassword: '',
    sourceUserAgent: '',

    targetLogin: '',
    targetPassword: '',
    targetUserAgent: ''
  },
  db: {
    host: '',
    port: '',
    database: '',
    username: '',
    password: '',
    dialect: ''
  }
};

let envConfig = {};

switch (env) {
  case 'dev':
  case 'development':
    envConfig = require('./dev').config;
    break;
  case 'prod':
  case 'production':
    envConfig = require('./prod').config;
    break;
  case 'test':
  case 'testing':
    envConfig = require('./testing').config;
  default:
    envConfig = require('./dev').config;
}

export default merge(baseConfig, envConfig);
