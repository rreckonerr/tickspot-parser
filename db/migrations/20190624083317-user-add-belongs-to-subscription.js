'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('users', 'subscription_id', {
      allowNull: false,
      type: Sequelize.INTEGER,
      reference: {
        model: 'subscriptions',
        key: 'id'
      }
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('users', 'subscription_id');
  }
};
