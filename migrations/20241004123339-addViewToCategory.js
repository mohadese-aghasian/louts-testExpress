'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.addColumn("Categories", "views", {
      type:Sequelize.DataTypes.INTEGER, 
      defaultValue:0,
    });
  },

  async down (queryInterface, Sequelize) {
    queryInterface.removeColumn("Categories", "views");
  }
};
