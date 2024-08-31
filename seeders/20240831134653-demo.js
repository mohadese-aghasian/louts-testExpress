'use strict';
const { faker } = require('@faker-js/faker');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    return queryInterface.bulkInsert('Orders', [
      {
        userId:faker.number.int({min:1,max:100}),
        total:faker.number.int({min:10,max:1000}),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Orders', null, {});
  }
};
