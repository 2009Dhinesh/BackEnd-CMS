const mongoose = require('mongoose');

const blockSchema = new mongoose.Schema({
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    required: true,
  },
  programme: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Programme',
    required: true,
  },
  blockName: {
    type: String,
    required: true,
    trim: true,
  },
}, {
  timestamps: true, // optional: adds createdAt and updatedAt
});

// Optional: enforce uniqueness so no duplicate blockName under same department + programme
blockSchema.index({ department: 1, programme: 1, blockName: 1 }, { unique: true });

module.exports = mongoose.model('Block', blockSchema);
