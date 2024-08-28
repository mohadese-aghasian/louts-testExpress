'use strict';

// /** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    
    await queryInterface.createTable("Products", {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type:Sequelize.INTEGER
          },
        title:{
            type:Sequelize.STRING,
            allowNull:false,
        },
        description:{
            type:Sequelize.STRING, 
            allowNull:false,
        },
        price:{
            type:Sequelize.FLOAT,
            allowNull:false,
        },
        cover:{
            type:Sequelize.STRING,
            allowNull:true,
        },
    });

    await queryInterface.createTable("ProductGallery", {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
          },
        productId:{
            type:Sequelize.INTEGER,
            allowNull:false,
            references:{
                model:"Products",
                key:'id'
            }
        },
        path:{
            type:Sequelize.STRING,
            allowNull:false,
        }
    });

    await queryInterface.createTable("Carts", {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
          },
        userId:{
        type:Sequelize.INTEGER,
            references:{
                model:'Users',
                key: 'id'
            }
        },
        total:{
            type:Sequelize.INTEGER,
            defaultValue:0
        },
    });
   

    await queryInterface.createTable("CartItems", {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
          },
        cartId:{
            type:Sequelize.INTEGER,
            allowNull:false,
            references:{
                model:'Carts',
                key:"id"
            }
        },
        productId:{
            type:Sequelize.INTEGER,
            allowNull:false,
            references:{
                model:'Products',
                key:"id"
            }
        },
        quantity:{
            type:Sequelize.INTEGER,
            defaultValue:1,
        }
    });

    await queryInterface.createTable("Orders", {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
          },
        userId: {
            type: Sequelize.INTEGER,
            allowNull:false,
            references: {
                model: 'Users',
                key: 'id'
            }
        },
        total:{
            type:Sequelize.INTEGER,
            defaultValue:0
        },
    });

    await queryInterface.createTable("OrderItems", {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
          },
      orderId:{
        type:Sequelize.INTEGER,
        allowNull:false,
        references:{
            model:'Orders',
            key:"id"
        }
    },
    productId:{
        type:Sequelize.INTEGER,
        allowNull:false,
        references:{
            model:'Products',
            key:"id"
        }
    },
    quantity:{
        type:Sequelize.INTEGER,
        defaultValue:1,
    }
    });
    await queryInterface.createTable("FavouriteProducts", {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
          },
      userId:{
        type:Sequelize.INTEGER,
        allowNull:false,
        references:{
            model:'Users',
            key: 'id'
        }
    },
    productId:{
        type:Sequelize.INTEGER,
        allowNull:false,
        references:{
            model:'Products',
            key:"id"
        }
    },
     });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable("FavouriteProduct");
    await queryInterface.dropTable("OrderItems");
    await queryInterface.dropTable("Orders");
    await queryInterface.dropTable("CartItems");
    await queryInterface.dropTable("Carts");
    await queryInterface.dropTable("ProductGallery");
    await queryInterface.dropTable("Products");
   
   
  
   
  }
};
