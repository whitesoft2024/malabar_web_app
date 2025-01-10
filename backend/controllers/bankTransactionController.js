const BranchTransaction = require('../models/bankTransactionModel')

//Create and save a new branch transaction
exports.create = async (req, res) => {
    const newBranchTransaction = new BranchTransaction(req.body)
    try {
        const savedBranchTransaction = await newBranchTransaction.save()
        res.status(201).json({
            success: true,
            message: 'Bank transaction added successfully',
            BranchTransaction: savedBranchTransaction
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error. Please try again',
            error: error.message
        })
    }
}

//Fetch all branch transactions
exports.getAll = async (req, res) => {
    try {
        const branchTransactions = await BranchTransaction.find({})
        res.status(200).json({
            success: true,
            message: 'Bank transactions fetched successfully',
            data: branchTransactions
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error. Please try again',
            error: error.message
        })
    }
} 