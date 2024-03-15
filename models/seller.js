const mongoose = require('mongoose');

const sellerSchema = new mongoose.Schema({
  company_name: {
    type: String,
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
  designation: {
    type: String,
    allowNull: true
  },
  email1: {
    type: String,
    allowNull: true
  },
  email2: {
    type: String,
    allowNull: true
  },
  address1: {
    type: String,
    allowNull: true
  },
  address2: {
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
  pincode: {
    type: Number,
    allowNull: true
  },
  website: {
    type: String,
    allowNull: true
  },
  phone1: {
    type: String,
    allowNull: true
  },
  phone2: {
    type: String,
    allowNull: true
  },
  gst: {
    type: String,
    allowNull: true
  },
  pan: {
    type: String,
    allowNull: true
  },
  turnover: {
    type: String,
    allowNull: true
  },
  industry: {
    type: String,
    allowNull: true
  },
  category: {
    type: String,
    allowNull: true
  },
  about: {
    type: String,
    allowNull: true
  },
  employees: {
    type: Number,
    allowNull: true
  },
  ownership_type: {
    type: String,
    allowNull: true
  },
  google_link: {
    type: String,
    allowNull: true
  },
  fb_link: {
    type: String,
    allowNull: true
  },
  instagram_link: {
    type: String,
    allowNull: true
  },
  tan: {
    type: String,
    allowNull: true
  },
  cin: {
    type: String,
    allowNull: true
  },
  import_export_code: {
    type: String,
    allowNull: true
  },
  is_active: {
    type: Boolean,
    default: true
  },
  filtered: {
    type: Boolean,
    default: false
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

const Seller = mongoose.model('Seller', sellerSchema);

module.exports = Seller;