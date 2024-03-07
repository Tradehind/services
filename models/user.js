const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
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
    allowNull: true
  },
  address: {
    type: String,
    allowNull: true
  },
  city: {
    type: String,
    allowNull: true
  },
  state: {
    type: String,
    allowNull: true
  },
  zipcode: {
    type: Number,
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

const User = mongoose.model('User', userSchema);

module.exports = User;