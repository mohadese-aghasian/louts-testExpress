'use strict';

// /** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable("Users", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      username: { 
          type: Sequelize.STRING,
          allowNull: false,
          unique: true
      },
      password: {
          type: Sequelize.STRING,
          allowNull: false
      },
      email:{
          type:Sequelize.STRING, 
          validate:{
              isEmail:{
                  msg:"must be a valid Email address!"
              }
          },
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

    await queryInterface.createTable('Blogs',
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        title: {
          type: Sequelize.STRING,
          allowNull: false
      },
      content: {
          type: Sequelize.TEXT,
          allowNull: false
      },
      likeNum:{
          type:Sequelize.INTEGER, 
          defaultValue:0,
      },
      authorId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',   
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        
      }
      }
    );
    await queryInterface.createTable("Likes", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      blogId: {
          type: Sequelize.INTEGER,
          references: {
              model: 'Blogs',
              key: 'id'
          }
      },
      userId: {
          type: Sequelize.INTEGER,
          references: {
              model: "Users",
              key: 'id'
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
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Likes');
    await queryInterface.dropTable('Blogs');
    await queryInterface.dropTable('Users');
    
  }
};
