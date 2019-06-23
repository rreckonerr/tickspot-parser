require('@babel/register');

const config = require('../../src/config').default;
const common = config.db;

module.exports = {
  development: common,
  production: common,
  test: common
};
