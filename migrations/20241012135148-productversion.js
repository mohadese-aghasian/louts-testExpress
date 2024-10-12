'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.createTable("ProductVersions", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      productId:{
        allowNull:false, 
        type:Sequelize.INTEGER,
        references:{
          model:'Products',
          key:'id'
        },
      },
      version:{
        type:Sequelize.INTEGER,
        allowNull:false,
      },
      changes:{
        type:Sequelize.JSONB,
        allowNull:false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      }
    })
  },

  async down (queryInterface, Sequelize) {
    queryInterface.dropTable('ProductVersions');
  }
};
