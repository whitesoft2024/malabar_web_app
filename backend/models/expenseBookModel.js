const mongoose = require('mongoose')

const expenseBookSchema = new mongoose.Schema({
    // branchName: String,
    branchCode: String,
    category: String,
    Frequency:String,
    expenseDetails:[{
        amount: Number,
        description: String,
        date: String,
        voucherNumber: String,
        remarks: String,
        category: String,
        Frequency:String
    }]
})

const ExpenseBook = mongoose.model('ExpenseBook', expenseBookSchema)

module.exports = ExpenseBook
