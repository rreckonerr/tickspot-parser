'use strict';

const testEntities = [
  {
    id: 76532374,
    date: '2019-06-20',
    hours: 1.5,
    notes: '//Test 2// spent 1.5 hours on this task',
    task_id: 13191691,
    user_id: 339351,
    url: 'http://secure.tickspot.com/126919/api/v2/entries/76532374.json',
    created_at: '2019-06-20T05:23:02.000-04:00',
    updated_at: '2019-06-20T05:30:18.000-04:00'
  },
  {
    id: 76532326,
    date: '2019-06-20',
    hours: 1.5,
    notes: '//Test 2// spent 1.5 hours on this task',
    task_id: 13191691,
    user_id: 339350,
    url: 'http://secure.tickspot.com/126919/api/v2/entries/76532326.json',
    created_at: '2019-06-20T05:19:26.000-04:00',
    updated_at: '2019-06-20T05:30:31.000-04:00'
  },
  {
    id: 76532321,
    date: '2019-06-20',
    hours: 1.5,
    notes: '//Test 1// spent 1.5 hours on this task',
    task_id: 13191691,
    user_id: 339349,
    url: 'http://secure.tickspot.com/126919/api/v2/entries/76532321.json',
    created_at: '2019-06-20T05:18:33.000-04:00',
    updated_at: '2019-06-20T05:18:33.000-04:00'
  }
];

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('entries', testEntities, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('entries', null, {});
  }
};
