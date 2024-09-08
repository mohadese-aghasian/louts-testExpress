'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.removeColumn("ProductCovers", "ProductId");
  },

  async down (queryInterface, Sequelize) {
    queryInterface.addColumn("ProductCovers", "ProductId",{
      type:Sequelize.INTEGER,
            allowNull:false,
            references:{
                model:"Products",
                key:'id'
            }
    });
  }
};
