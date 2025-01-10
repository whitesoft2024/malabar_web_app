// models/ApprovedFdBonds.js
const mongoose = require('mongoose');

const ApprovedFdBondsSchema = new mongoose.Schema({
  fdNumber: String,
  customerName: String,
  mobileNumber: String,
  fdAmount: Number,
  fdBondPercentage: Number,
  bondTransferAmount: Number,
  recipientBankAccount: String,
  branchName: String,
  branchCode: String,
  fdModelDetails: Object,
}, { timestamps: true });

module.exports = mongoose.model('ApprovedFdBonds', ApprovedFdBondsSchema);
