'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.renameTable("ProductGallery", "ProductGalleries");
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.renameTable("ProductGalleries","ProductGallery");
  }
};
