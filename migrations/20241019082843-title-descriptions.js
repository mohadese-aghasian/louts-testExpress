'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.createTable("TitlesDescriptions",{
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      url:{
        type:Sequelize.STRING, 
        allowNull:false,
      },
      titles:{
        type:Sequelize.JSONB,
      }, 
      descriptions:{
        type:Sequelize.JSONB,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type:Sequelize.DATE,
      }
    });
  },

  async down (queryInterface, Sequelize) {
    queryInterface.dropTable('TitlesDescriptions');
  }
};
