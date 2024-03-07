const { DataTypes } = require("sequelize");

const Seller = {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  company_name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  first_name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  last_name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  designation: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  email1: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  email2: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  address1: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  address2: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  city: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  state: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  pincode: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  website: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  phone1: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  phone2: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  gst: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  pan: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  turnover: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  industry: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  about: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  //----new fields----

  employees: {
    type: DataTypes.NUMBER,
    allowNull: true,
  },
  ownership_type: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  google_link: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  fb_link: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  instagram_link: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  tan: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  cin: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  import_export_code: {
    type: DataTypes.STRING,
    allowNull: true,
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
  Seller
};