// models/SuperAdmin.js
const mongoose = require('mongoose');

const superAdminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true
  },
  password: {
    type: String,
    required: [true, 'Password is required']
  }
}, { timestamps: true });

module.exports = mongoose.model('SuperAdmin', superAdminSchema);
