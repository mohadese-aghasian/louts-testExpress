'use strict';

const { query } = require('express');
const { sequelize } = require('../models');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // queryInterface.createTable("Categories", {
    //   id: {
    //     allowNull: false,
    //     autoIncrement: true,
    //     primaryKey: true,
    //     type: Sequelize.INTEGER
    //   },
    //   name:{
    //     allowNull:false,
    //     type:Sequelize.STRING,
    //     unique:true, 
    //   },
    //   parentId:{
    //     type:Sequelize.INTEGER,
    //     defaultValue:null,
    //     references:{
    //       model:"Categories",
    //       key:'id'
    //     }
    //   },
    //   createdAt: {
    //     allowNull: false,
    //     type: Sequelize.DATE,
        
    //   },
    //   updatedAt: {
    //     allowNull: false,
    //     type: Sequelize.DATE,
        
    //   }
    // });
    await queryInterface.createTable("ProductCategories", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      productId:{
        type:Sequelize.INTEGER,
        references:{
          model:"Products",
          key:"id"
        },
        allowNull:false
      },
      categoryId:{
        type:Sequelize.INTEGER, 
        references:{
          model:"Categories",
          key:"id"
        },
        allowNull:false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        
      }
    });
    // await queryInterface.addColumn("Products","category",{
    //   type:Sequelize.INTEGER,
    //   references:{
    //     model:"Categories",
    //     key:'id'
    //   },
    //   defaultValue:1
    // });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable("ProductCategories");
    await queryInterface.dropTable("Categories");
    await queryInterface.removeColumn("Products","category");
   
  }
};
