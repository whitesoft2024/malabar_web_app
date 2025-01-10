const mongoose = require('mongoose');

const RDSchema = new mongoose.Schema({
    sl_no: { type: Number },
    membershipId:{ type: String },
    customerName: { type: String },
    accountType: { type: String },
    schemeType: { type: String },
    customerNumber: { type: String },
    duration : { type: String },
    address: { type: String },
    interest: { type: Number },
    RDNumber: { type: String },
    rdBill: { type: String },
    // amount: { type: Number },
    startDate: { type: String },
    time:{ type: String }, 
    emiAmount:{type:Number},
    RDschemeType: { type: String },
    referenceName: { type: String },
    branchcode: { type: String },
    branchUser:{type:String},
    finalAmount:{type:Number},
    pendingEmiAmount:{
      type:Number 
    },
    amountPaidTillDate:{
      type:Number
    },
    InterestAmountTillDate:{
      type:Number ,
      default: 0
    },
    InterestTillDate:{
      type:Number,
      default:0
    },
    AmountTillDate:{
      type:Number,
      default:0
    },
    monthlyCollection:{
    type:Number,
    default:0
    },
    interestRecived:{
      type:Number,
      default:0
    },
    emi:[{
      amount: Number,
      date:String,
      time:String,
      branchUser:String,
      emiNumber:Number,
      currentInterestBalance:Number,
      currentInterest:Number
    }]
  });

  // Pre-save hook to set the time field to the current time
RDSchema.pre('save', function(next) {
  // Check if the document is new or modified
  if (!this.isNew ||!this.isModified('time')) {
      next();
      return;
  }

  // Set the time field to the current time
  this.time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  console.log('Setting time to:', this.time);
  next();
});
  
  
  const RDdata = mongoose.model('RDdata', RDSchema);
  
  module.exports = RDdata ;   