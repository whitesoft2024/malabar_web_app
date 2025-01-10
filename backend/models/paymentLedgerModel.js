const mongoose = require('mongoose')

const paymentLedgerSchema = new mongoose.Schema({
    branchName: String,
    branchCode: String,
    category: String,
    amount: String,
    description: String,
    date: String,
    voucherNumber: String,
    remarks: String
})

const PaymentLedger = mongoose.model('PaymentLedger', paymentLedgerSchema)

module.exports = PaymentLedger