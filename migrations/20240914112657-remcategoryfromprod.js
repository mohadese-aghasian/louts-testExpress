'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.removeColumn("Products", "category");
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.addColumn("Products","category",{
      type:Sequelize.INTEGER,
      references:{
        model:"Categories",
        key:'id'
      },
      defaultValue:1
    });
  }
};
