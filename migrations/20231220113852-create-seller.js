'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('sellers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      company_name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      first_name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      last_name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      designation: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      email1: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      email2: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      address1: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      address2: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      city: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      state: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      pincode: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      website: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      phone1: {
        type: Sequelize.STRING(15),
        allowNull: true,
      },
      phone2: {
        type: Sequelize.STRING(15),
        allowNull: true,
      },
      gst:{
          type: Sequelize.STRING,
          allowNull: true,
      },
      pan:{
          type: Sequelize.STRING,
          allowNull: true,
      },
      turnover:{
          type: Sequelize.STRING,
          allowNull: true,
      },
      industry:{
          type: Sequelize.STRING,
          allowNull: true,
      },
      category:{
          type: Sequelize.STRING,
          allowNull: true,
      },
      is_active:{
          type: Sequelize.BOOLEAN,
          default: true,
      },
      createdAt: {
        allowNull: true,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: true,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('sellers');
  }
};