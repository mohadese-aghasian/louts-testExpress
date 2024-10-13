'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.createTable("ProductVersions", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
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
        type:Sequelize.DATE,
      }
    },{
      
      indexes: [
          {
              unique: true,
              fields: ['productId', 'version']
          }
      ]
  });

  queryInterface.addColumn("Products", 'currentVersion',{
    type:Sequelize.INTEGER,
    defaultValue:0,
  });

  queryInterface.addConstraint("ProductCategories",{
    fields:['productId', 'categoryId'],
    type: 'unique',
    name:'unique_category_for_product'
  });



  },

  async down (queryInterface, Sequelize) {
    queryInterface.removeConstraint("ProductCategories",'unique_category_for_product');
    queryInterface.removeColumn("Products", 'currentVersion');
    queryInterface.dropTable('productVersions');
  }
};
