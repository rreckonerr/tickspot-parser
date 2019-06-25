'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('projects', 'owner_id', {
      allowNull: false,
      type: Sequelize.INTEGER,
      reference: {
        model: 'users',
        key: 'id'
      }
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('projects', 'owner_id');
  }
};
