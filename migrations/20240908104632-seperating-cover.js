'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.createTable("ProductCovers", {
          id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
          },
          ProductId:{
            type:Sequelize.INTEGER,
            allowNull:false,
            references:{
                model:"Products",
                key:'id'
            }
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
        },
        { transaction: t }),
        queryInterface.removeColumn("Products", "cover" ,{ transaction: t }),
      ]);
    });
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(t =>{
      return Promise.all([
        queryInterface.dropTable("ProductCovers", {transaction: t}),
        queryInterface.addColumn("Products", "cover", {transaction: t}),

      ]);
    });
  }
};
