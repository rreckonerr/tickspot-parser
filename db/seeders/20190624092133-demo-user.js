'use strict';

const testUsers = [
  {
    id: 339348,
    target_id: 123456,
    first_name: 'Volodymyr',
    last_name: 'Radchenko',
    email: 'bratko_bob@yahoo.com',
    timezone: 'Eastern Time (US & Canada)',
    created_at: '2019-06-20T05:08:29.000-04:00',
    updated_at: '2019-06-20T05:09:26.000-04:00',
    billable_rate: null,
    subscription_id: 126919
  },
  {
    id: 339349,
    target_id: 234567,
    first_name: 'Test 1',
    last_name: 'Test 1',
    email: 'rreckonerr@gmail.com',
    timezone: 'Eastern Time (US & Canada)',
    created_at: '2019-06-20T05:13:17.000-04:00',
    updated_at: '2019-06-20T05:17:31.000-04:00',
    billable_rate: null,
    subscription_id: 126919
  },
  {
    id: 339350,
    target_id: 345678,
    first_name: 'Test 2 ',
    last_name: 'Test 2',
    email: 'snowman.legalise@gmail.com',
    timezone: 'Eastern Time (US & Canada)',
    created_at: '2019-06-20T05:16:39.000-04:00',
    updated_at: '2019-06-20T05:17:17.000-04:00',
    billable_rate: null,
    subscription_id: 126919
  },
  {
    id: 339351,
    target_id: 456789,
    first_name: 'random dude',
    last_name: 'dude',
    email: 'random@dude.com',
    timezone: 'Eastern Time (US & Canada)',
    created_at: '2019-06-20T05:29:52.000-04:00',
    updated_at: '2019-06-20T05:29:52.000-04:00',
    billable_rate: null,
    subscription_id: 126919
  }
];

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('users', testUsers, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('users', null, {});
  }
};
