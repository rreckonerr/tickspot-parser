'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('subscriptions', {
      id: {
        allowNull: false,
        primaryKey: true,
        unique: true,
        type: Sequelize.INTEGER
      },
      target_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      company: {
        allowNull: false,
        type: Sequelize.STRING
      },
      api_token: {
        allowNull: false,
        type: Sequelize.STRING
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('subscriptions');
  }
};
