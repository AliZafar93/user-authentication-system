// backend/models/PersonalInfo.js

const mongoose = require('mongoose');

const personalInfoSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId, // Reference to the User model
    ref: 'User', // The model this ObjectId refers to
    required: true,     // Each personal info must be linked to a user
  },
  firstName: {
    type: String,
    required: [true, 'First name is required.'],
    trim: true,
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required.'],
    trim: true,
  },
  address: {
    type: String,
    trim: true,
    default: '', // Optional field
  },
  phone: {
    type: String,
    trim: true,
    default: '', // Optional field
    // You might want to add validation for phone number format
  },
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt fields
});

module.exports = mongoose.model('PersonalInfo', personalInfoSchema);
