const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // Ensures that each email is unique in the database
  },
  password: {
    type: String,
    required: true,
  },
}, {
  timestamps: true // This option adds `createdAt` and `updatedAt` fields automatically
});

module.exports = mongoose.model('User', userSchema);