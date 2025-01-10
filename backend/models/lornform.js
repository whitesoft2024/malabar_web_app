const mongoose = require('mongoose');

const loanForm = new mongoose.Schema({
  customerMobile: {
    type: String,
    required: true
  },
  customerName: {
    type: String,
    required: true
  },
  LOANtype: {
    type: String,
   
  },
  duration: {
    type: Number,
    required: true
  },
  emi: {
    type: Number,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  loanNumber: {
    type: String,
    required: true
  },
  referenceName: {
    type: String
  },
  interestHolding: {
    type: Number
  },
  balanceDisburse: {
    type: Number
  },
  processingFee: {
    type: Number
  },
  interest: {
    type: Number
  },
  membershipId: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});


module.exports = mongoose.model('loanForm', loanForm);


