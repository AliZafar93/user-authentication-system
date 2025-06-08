const mongoose = require('mongoose');

const flightSchema = new mongoose.Schema({
  flightNo: String,
  depPort: String,
  arrPort: String,
  acType: String,
  status: String,
  depTime: String,
  arrTime: String,
  validFrom: String,
  validUntil: String,
  dow: String,
  reportingGroup: String,
});

module.exports = mongoose.model('Flight', flightSchema);
