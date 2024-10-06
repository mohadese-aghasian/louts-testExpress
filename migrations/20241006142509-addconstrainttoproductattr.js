'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addConstraint('ProductAttributes', {
      fields: ['productId', 'attributeValueId'],
      type: 'unique',
      name:'unique_product_attribute_value',
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeConstraint('ProductAttributes', 'unique_product_attribute_value');
  }
};
