const mongoose = require('mongoose');

const FdBondSchema = new mongoose.Schema({
  percentage: {
    type: Number,
    required: true,
  },
  branchName: {
    type: String,
    required: true,
  },
  branchCode: {
    type: String,
    required: true,
  }
});

module.exports = mongoose.model('FdBond', FdBondSchema);
