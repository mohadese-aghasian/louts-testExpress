'use strict';

const { query } = require('express');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.renameTable("ProductAttributeValues", 'CategoryAttributeValues');
    queryInterface.addColumn("CategoryAttributeValues",'categoryId',{
      type:Sequelize.DataTypes.INTEGER,
      references:{
        model:'Categories',
        key:'id'
      },
    });
    queryInterface.removeColumn('CategoryAttributeValues','productId' );
    queryInterface.changeColumn('CategoryAttributeValues','value', {
      type:Sequelize.DataTypes.STRING,
      allowNull:false
    });
    queryInterface.createTable('ProductAttributes',{
      id:{
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      productId:{
        type:Sequelize.DataTypes.INTEGER,
        allowNull:false,
        references:{
          model:'Products',
          key:'id',
        }
      },
      attributeValueId:{
        type:Sequelize.DataTypes.INTEGER,
        references:{
          model:'CategoryAttributeValues',
          id:'id'
        },
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
    queryInterface.dropTable('ProductAttributes');
    queryInterface.changeColumn('CategoryAttributeValues','value', {
      type:Sequelize.ARRAY(Sequelize.STRING),
    });
    queryInterface.addColumn('CategoryAttributeValues','productId',{
      type:Sequelize.INTEGER, 
        references:{
          model:'Products',
          key:'id'
        },
        allowNull:false,
    });
    queryInterface.removeColumn("CategoryAttributeValues",'categoryId');
    queryInterface.renameTable('CategoryAttributeValues', "ProductAttributeValues" );

  }
};
