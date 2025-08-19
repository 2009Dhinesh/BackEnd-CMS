const mongoose = require('mongoose');

const ComplaintSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  block: {
    type: String,
    required: true,
  },
  room: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: [
      "PC Hardware",
      "PC Software",
      "Application issue",
      "Network",
      "Electronics",
      "Plumbing",
      "Other"
    ],
    required: true,
  },
  image: {
    type: String, // base64 or URL
    required: false, // make it optional
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Link to User schema
    required: true,
  }
},
{
  timestamps: true
});

const Complaint = mongoose.model("Complaint", ComplaintSchema);

module.exports = Complaint;
