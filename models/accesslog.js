const mongoose = require('mongoose');

const accessLogsSchema = new mongoose.Schema({
  userId: {
    type: Number,
    allowNull: true
  },
  method: {
    type: String,
    allowNull: true
  },
  route: {
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

const AccessLogs = mongoose.model('AccessLogs', accessLogsSchema);

module.exports = AccessLogs;