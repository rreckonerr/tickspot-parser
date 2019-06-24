'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('entries', {
      id: {
        allowNull: false,
        unique: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      date: {
        allowNull: false,
        type: Sequelize.STRING
      },
      hours: {
        type: Sequelize.FLOAT
      },
      notes: {
        type: Sequelize.STRING
      },
      // task_id: {
      //   allowNull: false,
      //   type: Sequelize.INTEGER
      // },
      // user_id: {
      //   allowNull: false,
      //   type: DataTypes.INTEGER
      // },
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
    return queryInterface.dropTable('entries');
  }
};
