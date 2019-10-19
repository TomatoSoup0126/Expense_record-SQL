'use strict';

const users = require('./fakeUser.json')
const records = require('./fakeRecord.json')
const bcrypt = require('bcryptjs')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    users.forEach(user => {
      //雜湊password
      let hash = bcrypt.hashSync(user.password, 10)
      user.password = hash
      user.createdAt = new Date()
      user.updatedAt = new Date()
    })

    records.forEach(record => {
      record.createdAt = new Date()
      record.updatedAt = new Date()
    })
    await queryInterface.bulkInsert('Users', users)
    await queryInterface.bulkInsert('Records', records)
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.bulkDelete('Users', null, {}),
      queryInterface.bulkDelete('Records', null, {}),
    ])
  }
};
