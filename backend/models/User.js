// backend/models/User.js

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required.'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required.'],
    unique: true, // Ensures email addresses are unique in the collection
    trim: true,
    lowercase: true, // Store emails in lowercase to avoid case-sensitivity issues
    match: [/.+\@.+\..+/, 'Please fill a valid email address.'], // Basic email format validation
  },
  password: {
    type: String,
    required: [true, 'Password is required.'],
    minlength: [6, 'Password must be at least 6 characters long.'], // Example: enforce minimum password length
  },
  // The manual doesn't explicitly include 'age' in the User model for auth,
  // but it's mentioned in the users.js route for general user CRUD.
  // If age is part of user registration, add it here.
  // For now, sticking to the auth-focused User model from the PDF's initial model setup.
  // age: {
  //   type: Number,
  // }
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt fields
});

module.exports = mongoose.model('User', userSchema);
