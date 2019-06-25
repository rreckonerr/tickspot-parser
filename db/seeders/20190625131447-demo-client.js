'use strict';

const testClients = [
  {
    id: 374721,
    name: 'Some Inc.',
    archive: false,
    url: 'http://secure.tickspot.com/126919/api/v2/clients/374721.json',
    updated_at: '2019-06-20T05:30:31.000-04:00'
  }
];

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('clients', testClients, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('clients', null, {});
  }
};
