// models/closingDenomination.js
const mongoose = require('mongoose');

const closingDenominationSchema = new mongoose.Schema({
  netCash: String,
  closingBalance: String,
  shortage: String,
  excess: String,
  date: String,
  branchCode: String,
  total500: String,
  total200: String,
  total100: String,
  total50: String,
  total20: String,
  total10: String,
  coinsAmount: String,
  stampsAmount: String,
});

const ClosingDenomination = mongoose.model('ClosingDenomination', closingDenominationSchema);

module.exports = ClosingDenomination;
