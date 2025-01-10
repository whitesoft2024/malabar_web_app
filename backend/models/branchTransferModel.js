const mongoose = require('mongoose')

const branchTransferSchema = new mongoose.Schema({
    fromBranch: String,
    toBranch: String,
    amount: String,
    reason: String,
    date: String,
    // status: String,
    selectedPaymentMethod: String,
    transactionId: String,
    cashTransactionId: String,
    beneficiaryName: String,
    bankName: String,
    ifsc: String,
    accountNumber: String
})

const  BranchTransfer = mongoose.model('BranchTransfer', branchTransferSchema)

module.exports = BranchTransfer
