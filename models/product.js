const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  seller_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Seller'
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  specification: {
    type: String,
    required: true
  },
  category_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  },
  sub_category_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subcategory'
  },
  sub_sub_category_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subsubcategory'
  },
  primary_image: {
    type: String
  },
  is_active: {
    type: Boolean,
    default: true
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

const Product = mongoose.model('Product', productSchema);

module.exports = Product;