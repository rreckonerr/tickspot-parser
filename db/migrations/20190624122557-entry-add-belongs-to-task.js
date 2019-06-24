'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('entries', 'task_id', {
      allowNull: false,
      type: Sequelize.INTEGER,
      reference: {
        model: 'tasks',
        key: 'id'
      }
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('entries', 'task_id');
  }
};
