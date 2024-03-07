const mongoose = require('mongoose');

const subcategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  category_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
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

subcategorySchema.virtual('subsubcategories', {
  ref: 'Subsubcategory',
  localField: '_id',
  foreignField: 'sub_category_id'
});

const Subcategory = mongoose.model('Subcategory', subcategorySchema);

module.exports = Subcategory;