'use strict';

const testSubscriptions = [
  {
    id: 126919,
    company: 'Some Inc.',
    api_token: '5cdbec7bb9e3d2449696b565d157d248',
    target_id: 123512,
    created_at: new Date(),
    updated_at: new Date()
  }
];

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('subscriptions', testSubscriptions, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('subscriptions', null, {});
  }
};
