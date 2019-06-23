'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Projects', 'subscription_id', {
      allowNull: false,
      type: Sequelize.INTEGER,
      reference: {
        model: 'Subscriptions',
        key: 'id'
      }
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Projects', 'subscription_id');
  }
};
