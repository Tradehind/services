const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  is_guest: {
    type: Boolean,
    required: true
  },
  name: {
    type: String,
    allowNull: true
  },
  email: {
    type: String,
    allowNull: true
  },
  phone: {
    type: String,
    allowNull: true
  },
  user_id: {
    type: Number,
    allowNull: true
  },
  requirement_text: {
    type: String,
    allowNull: true
  },
  quantity: {
    type: Number,
    allowNull: true
  },
  unit: {
    type: String,
    allowNull: true
  },
  order_frequency: {
    type: String,
    allowNull: true
  },
  lat: {
    type: String,
    allowNull: true
  },
  long: {
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
  status: {
    type: String,
    allowNull: true
  },
  inquiry_from: {
    type: String,
    allowNull: true
  },
  resolved_by: {
    type: Number,
    allowNull: true
  },
  other: {
    type: String,
    allowNull: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true
  },
  updatedAt: {
    type: Date,
    default: Date.now,
    required: true
  }
});

const Lead = mongoose.model('Lead', leadSchema);

module.exports = Lead;