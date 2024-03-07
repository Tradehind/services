const { Sequelize, DataTypes } = require('sequelize');
const config = require('./config.json');
// Sequelize initialization
const dataTypes = DataTypes;
const sequelize = new Sequelize({
    dialect: 'oracle',
    host: config.development.host,
    port: config.development.port,
    username: config.development.username, // Replace with your Oracle username
    password: config.development.password, // Replace with your Oracle password
  
    dialectOptions: {
      connectString: config.development.connectionString,
      // Example connectString: '192.168.0.234:1521/orcl'
    }
  });