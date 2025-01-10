const mongoose = require('mongoose');

const loanSchema = new mongoose.Schema({
  schemeName: { type: String, required: true },
  requestedLoanAmount: { type: Number, required: true },
  tenure: { type: Number, required: true },
  interestPercentage: { type: String },
  recoveryMode: { type: String },
  totalLoanAmount: { type: Number, required: true },
  processingFee: { type: Number },
  documentationCharge: { type: Number,required: true },
  interestHolding: { type: Number },
  balanceDisburse: { type: Number },
  emi: { type: Number }
});

module.exports = mongoose.model('loanScheme', loanSchema);
