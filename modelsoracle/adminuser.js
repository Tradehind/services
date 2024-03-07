const { DataTypes } = require("sequelize");

const AdminUser = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  username: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: true
  },
  role: {
    type: DataTypes.STRING(30),
    allowNull: true
  },
  alloted_region: {
    type: DataTypes.STRING(30),
    allowNull: true
  },
  alloted_city: {
    type: DataTypes.STRING(30),
    allowNull: true
  },
  first_name: {
    type: DataTypes.STRING,
    allowNull: true
  },
  last_name: {
    type: DataTypes.STRING,
    allowNull: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true
  },
  phone: {
    type: DataTypes.NUMBER(13),
    allowNull: true
  },
  address: {
    type: DataTypes.STRING,
    allowNull: true
  },
  city: {
    type: DataTypes.STRING(30),
    allowNull: true
  },
  state: {
    type: DataTypes.STRING(40),
    allowNull: true
  },
  zipcode: {
    type: DataTypes.NUMBER(7),
    allowNull: true
  },
  lat: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  long: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    allowNull: true
  },
}

module.exports = {
  AdminUser
};