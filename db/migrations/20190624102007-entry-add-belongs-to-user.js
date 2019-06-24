'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('entries', 'user_id', {
      allowNull: false,
      type: Sequelize.INTEGER,
      reference: {
        model: 'users',
        key: 'id'
      }
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('entries', 'user_id');
  }
};
