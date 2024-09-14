'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable("Categories", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name:{
        allowNull:false,
        type:Sequelize.STRING,
        unique:true, 
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

    await queryInterface.createTable("SubCategories",{
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name:{
        allowNull:false,
        type:Sequelize.STRING,
        unique:true, 
      },
      categoryId:{
        type:Sequelize.INTEGER,
        references:{
          model:"Categories",
          key:"id",
        }
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
      subCategoryId:{
        type:Sequelize.INTEGER, 
        references:{
          model:"SubCategories",
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
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable("Categories");
    await queryInterface.dropTable("SubCategories");
    await queryInterface.dropTable("ProductCategories");
  }
};
