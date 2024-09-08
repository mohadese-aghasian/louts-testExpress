'use strict';

const { sequelize } = require('../models');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.addColumn("Products", "coverId",{
      type:Sequelize.INTEGER,
      allowNull:true,
      references:{
        model:"ProductCovers",
        key:"id",
      },
    });
  },

  async down (queryInterface, Sequelize) {
    queryInterface.removeColumn('products', 'coverId');
  }
};
