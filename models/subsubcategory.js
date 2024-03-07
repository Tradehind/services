const mongoose = require('mongoose');

const subsubcategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  category_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  },
  sub_category_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subcategory'
  },
  description: {
    type: String,
    allowNull: true
  },
  icon: {
    type: String,
    allowNull: true
  },
  image: {
    type: String,
    allowNull: true
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

const Subsubcategory = mongoose.model('Subsubcategory', subsubcategorySchema);

module.exports = Subsubcategory;