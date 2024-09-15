'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.createTable('CategoryPaths', {
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
      path:{
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
    queryInterface.createTable("ProductCategoryPaths", {
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
          model:"CategoryPaths",
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
    queryInterface.dropTable("ProductCategoryPaths");
    queryInterface.dropTable("CategoryPaths");
  }
};
