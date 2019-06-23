'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Subscriptions', {
      id: {
        allowNull: false,
        primaryKey: true,
        unique: true,
        type: Sequelize.INTEGER
      },
      // subscription_id: {
      //   allowNull: false,
      //   primaryKey: true,
      //   unique: true,
      //   type: Sequelize.INTEGER
      // },
      company: {
        allowNull: false,
        type: Sequelize.STRING
      },
      api_token: {
        allowNull: false,
        type: Sequelize.STRING
      },
      // project_id: {
      //   allowNull: true,
      //   type: Sequelize.INTEGER,
      //   references: {
      //     model: 'Projects',
      //     key: 'id'
      //   }
      // },
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
    return queryInterface.dropTable('Subscriptions');
  }
};
