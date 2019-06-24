'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('tasks', {
      id: {
        allowNull: false,
        unique: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      budget: {
        type: Sequelize.FLOAT
      },
      position: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      // project_id: {
      //   allowNull: false,
      //   type: Sequelize.INTEGER
      // },
      date_closed: {
        allowNull: true,
        type: Sequelize.DATE
      },
      billable: {
        allowNull: false,
        type: Sequelize.BOOLEAN
      },
      url: {
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
    return queryInterface.dropTable('tasks');
  }
};
