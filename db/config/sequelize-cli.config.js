require('dotenv').config();

const {
  DB_SERVER_HOST,
  DB_SERVER_PORT,
  DB_USERNAME,
  DB_PASSWORD,
  DB_DATABASE,
  DB_DIALECT
} = process.env;

const common = {
  database: DB_DATABASE,
  username: DB_USERNAME,
  password: DB_PASSWORD,
  host: DB_SERVER_HOST,
  port: DB_SERVER_PORT,
  dialect: DB_DIALECT,
  dialectOptions: {
    ssl: true
  }
};

module.exports = {
  development: common,
  production: common,
  test: common
};
