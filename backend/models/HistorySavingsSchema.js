const mongoose = require('mongoose');

const HistorySchema = new mongoose.Schema({
  branchUser:{type:String},
  userTime:{type:String},
  branchCode:{type:String},
  accountNumber: { type: String, required: true },
  fieldUpdated: { type: String},
  previousValue: { type: String },
  newValue: { type: String },
  transactionID:{type:String},
  updatedBy: { type: String},
  updatedAt: { type: String },
  // updatedAt: { type: Date, default: Date.now },
  action: {type:String},
  amount:{type:String},
  customerName:{type:String},
  customerNumber:{type:String},
  transactionID:{type:String},
  payslipNumber:{type:String},

});

const Savinghistories= mongoose.model('Savinghistories', HistorySchema);

module.exports = Savinghistories;
