'use strict';

const testTasks = [
  {
    id: 13191691,
    name: 'Step 1',
    budget: 25,
    position: 1,
    project_id: 1830355,
    date_closed: null,
    billable: true,
    url: 'http://secure.tickspot.com/126919/api/v2/tasks/13191691.json',
    created_at: '2019-06-20T05:11:29.000-04:00',
    updated_at: '2019-06-20T05:30:31.000-04:00'
  },
  {
    id: 13191692,
    name: 'Step 2',
    budget: 25,
    position: 2,
    project_id: 1830355,
    date_closed: null,
    billable: true,
    url: 'http://secure.tickspot.com/126919/api/v2/tasks/13191692.json',
    created_at: '2019-06-20T05:11:29.000-04:00',
    updated_at: '2019-06-20T05:11:29.000-04:00'
  },
  {
    id: 13191693,
    name: 'Step 3',
    budget: 25,
    position: 3,
    project_id: 1830355,
    date_closed: null,
    billable: true,
    url: 'http://secure.tickspot.com/126919/api/v2/tasks/13191693.json',
    created_at: '2019-06-20T05:11:29.000-04:00',
    updated_at: '2019-06-20T05:11:29.000-04:00'
  },
  {
    id: 13191694,
    name: 'Step 4',
    budget: 25,
    position: 4,
    project_id: 1830355,
    date_closed: null,
    billable: true,
    url: 'http://secure.tickspot.com/126919/api/v2/tasks/13191694.json',
    created_at: '2019-06-20T05:11:29.000-04:00',
    updated_at: '2019-06-20T05:11:29.000-04:00'
  }
];

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('tasks', testTasks, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('tasks', null, {});
  }
};
