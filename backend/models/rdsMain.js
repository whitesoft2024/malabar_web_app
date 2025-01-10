const mongoose = require('mongoose');

const RDSmain = new mongoose.Schema({
  sl_no: { type: Number },
  branchCodeUser: { type: String ,require}, 
  branchUser: { type: String ,require}, 
  userTime: { type: String ,require},
  RDSNumber:{ type: String },
  customerName:{ type: String },
  customerNumber: {type :String},
  amount:{ type: String},
  membershipId:{ type: String },
  newDate:{ type: String },
  referenceName:{ type: String },
  address:{ type: String },
  rdsBill:{ type: String ,require},
  transactionId:{ type: String },
  branchCode:{ type: String },
  addreferenceName:{type:String},
  time:{type:String},
  EmiData: [{
    emiNo: { type: String },
    newAmount: { type: String },
    withdrawalAmount : { type: String},
    Date: { type: String },
    referenceName: { type: String },
    User: { type: String },
    userTime: { type: String },
    time:{type:String},
    branchCode: { type: String },
    depositRdsBill: { type: String },
    withdrawRdsBill: { type: String },
    depositTransactionId:{type:String},
    withdrawTransactionId:{type:String},
    Type: {type:String},
    balanceAmount: {type:String}
  }]
});

RDSmain.pre('save', async function(next) {
  try {
    if (!this.sl_no) {
      // Check if serial number already exists
      const lastMembership = await this.model('RDS').findOne({}, {}, { sort: { 'sl_no': -1 } });
      const lastSiNo = lastMembership ? lastMembership.sl_no : 0;
      this.sl_no = lastSiNo + 1; // Increment serial number
    }
    next();
  } catch (error) {
    next(error);
  }
});

const RDS = mongoose.model('RDS', RDSmain);

module.exports = RDS;
