'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('projects', 'subscription_id', {
      allowNull: false,
      type: Sequelize.INTEGER,
      reference: {
        model: 'subscriptions',
        key: 'id'
      }
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('projects', 'subscription_id');
  }
};
