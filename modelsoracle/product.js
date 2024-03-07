const { DataTypes } = require("sequelize");

const Product = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  seller_id: {
    type: DataTypes.NUMBER
  },
  name: {
    type: DataTypes.STRING,
  },
  price: {
    type: DataTypes.NUMBER
  },
  description: {
    type: DataTypes.TEXT
  },
  specification: {
    type: DataTypes.TEXT
  },
  category_id: {
    type: DataTypes.NUMBER
  },
  sub_category_id: {
    type: DataTypes.NUMBER
  },
  sub_sub_category_id: {
    type: DataTypes.NUMBER
  },
  primary_image: {
    type: DataTypes.STRING
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    default: true,
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE
  },
  updatedAt: {
    allowNull: false,
    type: DataTypes.DATE
  }
}

module.exports = {
  Product
};