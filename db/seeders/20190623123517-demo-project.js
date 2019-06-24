'use strict';

const testProjects = [
  {
    id: 1830355,
    name: 'Simply The Best',
    budget: 100,
    date_closed: null,
    notifications: false,
    billable: true,
    recurring: false,
    client_id: 374721,
    owner_id: 339348,
    subscription_id: 126919,
    url: 'http://secure.tickspot.com/126919/api/v2/projects/1830355.json',
    created_at: '2019-06-20T05:11:29.000-04:00',
    updated_at: '2019-06-20T05:30:31.000-04:00'
  }
];

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('projects', testProjects, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('projects', null, {});
  }
};
