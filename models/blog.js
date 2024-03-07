const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    allowNull: true
  },
  description: {
    type: String,
    allowNull: true
  },
  added_by: {
    type: Number,
    allowNull: true
  },
  image: {
    type: String,
    allowNull: true
  },
  other: {
    type: String,
    allowNull: true
  },
  is_active: {
    type: Boolean,
    allowNull: true
  }
});

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;