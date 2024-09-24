'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.createTable('Attributes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name:{
        type:Sequelize.STRING,
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
    });

    queryInterface.createTable('ProductAttributeValues', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      attributeId:{
        type:Sequelize.INTEGER,
        references:{
          model:'Attributes',
          key:'id'
        },
        allowNull:false,
      },
      productId:{
        type:Sequelize.INTEGER, 
        references:{
          model:'Products',
          key:'id'
        },
        allowNull:false,
      },
      value:{
        type:Sequelize.ARRAY(Sequelize.STRING),
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
    queryInterface.dropTable('ProductAttributeValues');
    queryInterface.dropTable('Attributes');
  }
};
