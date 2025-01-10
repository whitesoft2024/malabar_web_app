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
    type: String,
  },
  time:{
    type:String,

  },
  recoveryMode:{
    type:String,
    required:true
  },
  totalLoanAmount:{
    type:Number,
    required:true
  },
  branchCode:{
    type:String
  },
  pendingEmiAmount:{
    type:Number 
  },
  amountPaidtillDate:{
    type:Number ,
    default: 0
  },
  loanEMI:[{
    amount: Number,
    date:String,
    emiNumber:String,
    currentEmiBalance:Number
    
    
  }]
});


module.exports = mongoose.model('loanForm', loanForm);



// const mongoose = require('mongoose');
// const { Schema } = mongoose;

// // Correctly import ObjectId
// const { ObjectId } = Schema.Types;

// const loanFormSchema = new Schema({
//   customerMobile: {
//     type: String,
//     required: true
//   },
//   customerName: {
//     type: String,
//     required: true
//   },
//   LOANtype: {
//     type: String,
//   },
//   duration: {
//     type: Number,
//     required: true
//   },
//   emi: {
//     type: Number,
//     required: true
//   },
//   amount: {
//     type: Number,
//     required: true
//   },
//   loanNumber: {
//     type: String,
//     required: true
//   },
//   referenceName: {
//     type: String
//   },
//   interestHolding: {
//     type: Number
//   },
//   balanceDisburse: {
//     type: Number
//   },
//   processingFee: {
//     type: Number
//   },
//   interest: {
//     type: Number
//   },
//   membershipId: {
//     type: String,
//     required: true
//   },
//   date: {
//     type: Date,
//     default: Date.now
//   },
//   recoveryMode: {
//     type: String,
//     required: true
//   },
//   loanEMI: {
//     type: ObjectId, // Corrected to use ObjectId for referencing
//     ref: 'loanEMI' // Corrected to use the model name
//   },
// });


//  module.exports = mongoose.model('loanForm', loanForm);


