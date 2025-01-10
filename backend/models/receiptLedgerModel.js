const mongoose = require('mongoose')

const receiptLedgerSchema = new mongoose.Schema({
    branchName: String,
    branchCode: String,
    category: String,
    amount: String,
    description: String,
    date: String,
    recieptNumber: String,
    remarks: String
})

const ReceiptLedger = mongoose.model('ReceiptLedger', receiptLedgerSchema)

module.exports = ReceiptLedger