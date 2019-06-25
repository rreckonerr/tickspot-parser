'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('projects', 'client_id', {
      allowNull: false,
      type: Sequelize.INTEGER,
      reference: {
        model: 'clients',
        key: 'id'
      }
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('projects', 'client_id');
  }
};
