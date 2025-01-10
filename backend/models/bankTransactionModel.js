const mongoose = require('mongoose')

const bankTransactionSchema = new mongoose.Schema({
    branchUser: String,
    amount: String,
    description: String,
    transactionType: String,
    credit: String,
    debit: String,
    date: String,
    remarks: String,
    openingBalance: String,
    closingBalance: String
})

const BankTransaction = mongoose.model('BankTransaction', bankTransactionSchema)

module.exports = BankTransaction 
