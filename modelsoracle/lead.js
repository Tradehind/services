const { DataTypes } = require("sequelize");

const Lead = {
  is_guest: {
    type: DataTypes.BOOLEAN
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  requirement_text: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  unit: {
    type: DataTypes.STRING,
    allowNull: true
  },
  order_frequency: {
    type: DataTypes.STRING,
    allowNull: true
  },
  lat: {
    type: DataTypes.STRING,
    allowNull: true
  },
  long: {
    type: DataTypes.STRING,
    allowNull: true
  },
  city: {
    type: DataTypes.STRING,
    allowNull: true
  },
  state: {
    type: DataTypes.STRING,
    allowNull: true
  },
  status:{
    type: DataTypes.STRING,
    allowNull: true
  },
  inquiry_from:{
    type: DataTypes.STRING,
    allowNull: true
  },
  resolved_by:{
    type: DataTypes.INTEGER,
    allowNull: true
  },
  other:{
    type: DataTypes.STRING,
    allowNull: true
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
  Lead
};