const mongoose = require('mongoose');

const FixedSchema = new mongoose.Schema({
    sl_no: { type: Number },
    branchCodeUser: { type: String},
    branchName:{type:String},
    branchUser: { type: String}, 
    userTime: { type: String},
    customerNumber: { type: String}, 
    schemeType:{ type: String },
    accountType: {type :String} ,
    duration:{ type: String },
    durationInMonths:{type:Number },
    amount:{ type: String },
    amountInWords:{type:String},
    interest: {type : Number},
    finalInterest: {type : Number},
    membershipId:{ type: String },
    interestCutAfter:{ type : String},
    interestCutBefore:{ type:String},
    FDNumber: { type: String },
    customerName: { type: String} ,
    address:{ type: String },
    referenceName:{ type: String },
    newDate:{ type: String },
    totalAmount:{ type: Number },
    totalAmountInWords:{type:String},
    fdBill:{ type: String },
    accountStatus:{type: String },
    matureDate:{type: String },
    nomineeName:{type:String},
    nomineeRelationship:{type:String},





     // New fields
     totalIntFdBal:{type:Number},
     interestBalance:{type:Number},
     InterestWithdrawal: [{ 
      date: { type: String }, 
      amount: { type: Number } ,
      branchUser:{type:String}
    }],  // Tracks monthly credited interest

     monthlyInterest: [{ 
      date: { type: Date }, 
      amount: { type: Number } 
    }],  // Tracks monthly credited interest
    lastInterestCredited: { type: Date, default: Date.now },  // To track when interest was last credited
  });

  FixedSchema.pre('save', async function(next) {
    try {
      if (!this.sl_no) {
        // Check if serial number already exists
        const lastMembership = await FixedData.findOne({}, {}, { sort: { 'sl_no': -1 } });
        const lastSiNo = lastMembership ? lastMembership.sl_no : 0;
        this.sl_no = lastSiNo + 1; // Increment serial number
      }
      next();
    } catch (error) {
      next(error);
    }
  });
  
  const FixedData = mongoose.model('FixedData', FixedSchema);
  
  module.exports = FixedData ;  