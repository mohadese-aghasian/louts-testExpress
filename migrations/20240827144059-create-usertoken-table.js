'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable("UserTokens", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: {
            model: 'Users', 
            key: 'id'
        },
        onDelete: 'CASCADE'
      },
      token: {
          type: Sequelize.TEXT,
          allowNull: false
      },
      created_at: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.NOW
      }
}, {
    timestamps: false
    });
  },

  async down (queryInterface, Sequelize) {
   await queryInterface.dropTable("UserTokens");
  }
};
