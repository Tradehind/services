const mongoose = require('mongoose');

const adminUserSchema = new mongoose.Schema({
    username: {
      type: String,
      maxlength: 50,
      allowNull: true
    },
    password: {
      type: String,
      allowNull: true
    },
    role: {
      type: String,
      maxlength: 30,
      allowNull: true
    },
    alloted_region: {
      type: String,
      maxlength: 30,
      allowNull: true
    },
    alloted_city: {
      type: String,
      maxlength: 30,
      allowNull: true
    },
    first_name: {
      type: String,
      allowNull: true
    },
    last_name: {
      type: String,
      allowNull: true
    },
    email: {
      type: String,
      allowNull: true
    },
    phone: {
      type: Number,
      max: 9999999999999, // 13 digits
      allowNull: true
    },
    address: {
      type: String,
      allowNull: true
    },
    city: {
      type: String,
      maxlength: 30,
      allowNull: true
    },
    state: {
      type: String,
      maxlength: 40,
      allowNull: true
    },
    zipcode: {
      type: Number,
      max: 9999999, // 7 digits
      allowNull: true
    },
    lat: {
      type: Number,
      allowNull: true
    },
    long: {
      type: Number,
      allowNull: true
    },
    is_active: {
      type: Boolean,
      allowNull: true
    }
  });

  const AdminUser = mongoose.model('AdminUser', adminUserSchema);

  module.exports = AdminUser;