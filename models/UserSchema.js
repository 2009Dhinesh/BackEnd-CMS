const mongoose = require('mongoose');

// Define schema
const UserSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: true 
    },
    phone: { 
      type: String, 
      required: true 
    },
    email: { 
      type: String, 
      required: true, 
      unique: true 
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Role', // Refers to Role collection
      required: true
    },
    department: { 
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department', // Refers to Department collection
      required: true
    },
    programme: { 
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Programme', // Refers to Programme collection
      required: true
    }
  }, 
  {
    timestamps: true
  }
);

const User = mongoose.model('User', UserSchema);
module.exports = User;
