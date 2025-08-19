// models/Department.js
const mongoose = require('mongoose');

// Ensure SuperAdmin model is registered before using it in ref
require('./SuperAdmin'); // <-- Import your SuperAdmin model file

const departmentSchema = new mongoose.Schema(
  {
    departmentName: {
      type: String,
      required: [true, 'Department Name is required'],
      trim: true
    },
    shortName: {
      type: String,
      required: [true, 'Short Name is required'],
      trim: true,
      uppercase: true,
      maxlength: 10
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SuperAdmin',
      required: [true, 'CreatedBy is required']
    }
  },
  { timestamps: true }
);

departmentSchema.index({ departmentName: 1 }, { unique: true });

module.exports = mongoose.model('Department', departmentSchema);
