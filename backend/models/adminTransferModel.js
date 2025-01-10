const mongoose = require('mongoose')

const adminTransferSchema = new mongoose.Schema({
    fromBranch: String,
    toBranch: String,
    amount: String,
    reason: String,
    date: String,
    selectedPaymentMethod: String,
    transactionId: String,
    cashTransactionId: String,
    beneficiaryName: String,
    bankName: String,
    ifsc: String,
    accountNumber: String
})

const AdminTransfer = mongoose.model('AdminTransfer', adminTransferSchema)

module.exports = AdminTransfer
