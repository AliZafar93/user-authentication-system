const mongoose = require('mongoose');

const recordSchema = new mongoose.Schema({
  // Define your attributes, e.g.:
  name: String,
  email: String,
  age: Number,
  // ...other fields
});

module.exports = mongoose.model('Record', recordSchema);