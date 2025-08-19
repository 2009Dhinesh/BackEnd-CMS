// models/Programme.js
const mongoose = require('mongoose');

const programmeSchema = new mongoose.Schema({
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    required: true
  },
  programme: {
    type: String,
    required: true
  },
  programmeShortName: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Programme', programmeSchema);
