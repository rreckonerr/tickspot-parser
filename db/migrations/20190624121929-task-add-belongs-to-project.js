'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('tasks', 'project_id', {
      allowNull: false,
      type: Sequelize.INTEGER,
      reference: {
        model: 'projects',
        key: 'id'
      }
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('tasks', 'project_id');
  }
};
