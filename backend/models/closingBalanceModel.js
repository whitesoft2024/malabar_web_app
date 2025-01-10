const mongoose = require('mongoose');

const closingBalanceSchema = new mongoose.Schema({
    date: { type: String, required: true },
    closingBalance: { type: String },
    branchCode: {type:String, required: true},
    // openingBalance : {type: String, required: true},
    totalCredit : {type: String, required: true},
    totalDebit : {type: String, required: true},
  });

closingBalanceSchema.index({ branchCode: 1, date: 1 }, { unique: true });

const ClosingBalance = mongoose.model('ClosingBalance', closingBalanceSchema);

module.exports = ClosingBalance;
