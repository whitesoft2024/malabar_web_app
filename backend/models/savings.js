const mongoose = require('mongoose');

const SaveSchema = new mongoose.Schema({
    sl_no:{type: Number},
    branchUser:{type:String},
    branchUserDate:{type:String},
    branchUserTime:{type:String}, 
    membershipId:{ type: String },
    customerName:{ type: String },
    accountNumber:{ type: String },
    customerNumber: {type : String}, 
    address:{ type: String },
    type:{type:String},
    newDate:{ type: String },
    deposit:{ type: String },
    depositwords:{ type: String },
    type: {type: String},
    remark:{type:String},
    transactionId:{type:String},
    savingsBill:{type:String},
    printedStatus:{type:Boolean},
    transferData: [{
      referenceName: { type: String },
      accountBranchName: {type: String},
      User: { type: String },
      userDate:{ type: String },
      userTime: { type: String },
      time:{type:String},
      Date: { type: String },
      branchCode: { type: String },
      newAmount: { type: String },
      withdrawalAmount : { type: String},
      balance : { type: String},
      newTime: { type: String},
      depositSavingsBill: { type: String },
      withdrawSavingsBill: { type: String },
      depositTransactionId:{type:String},
      withdrawTransactionId:{type:String},
      Type: {type:String},
      total: {type: String},
      balanceAmount:{type : String},
      printedStatus: {type: Boolean}
    }]
  });

  SaveSchema.pre('save', async function(next){
    try {
      if(!this.sl_no){
        const lastMembership = await this.model('SavingsData').findOne({},{},{},{ sort: {'sl_no':-1}});
        const lastSiNo = lastMembership ? lastMembership.sl_no : 0;
        this.sl_no = lastSiNo + 1; // Increment serial number
      }
      next();
  } catch (error) {
    next(error);
  }
  })
  
  const SavingsData = mongoose.model('SavingsData', SaveSchema);
  
  module.exports = SavingsData ;  