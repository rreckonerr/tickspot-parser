'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Projects', {
      id: {
        allowNull: false,
        unique: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      budget: {
        type: Sequelize.INTEGER
      },
      date_closed: {
        allowNull: true,
        type: Sequelize.DATE
      },
      notifications: {
        type: Sequelize.BOOLEAN
      },
      billable: {
        type: Sequelize.BOOLEAN
      },
      recurring: {
        type: Sequelize.BOOLEAN
      },
      client_id: {
        type: Sequelize.INTEGER
      },
      owner_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      // subscription_id: {
      //   allowNull: false,
      //   type: Sequelize.INTEGER
      // },
      url: {
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
    return queryInterface.dropTable('Projects');
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
