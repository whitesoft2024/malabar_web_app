const BranchTransfer = require('../models/branchTransferModel')

// Create and Save a new Branch transfer
exports.create = async (req, res) => {
    const newBranchTransfer = new BranchTransfer(req.body);
    try {
        const savedBranchTransfer = await newBranchTransfer.save();
        res.status(201).json({
            success: true,
            message: 'Money transferred successfully',
            BranchTransfer: savedBranchTransfer,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error. Please try again',
            error: error.message,
        })
    }
}

// Fetch all branch transfers
exports.getAll = async (req, res) => {
    try {
        const branchTransfers = await BranchTransfer.find({});
        res.status(200).json({
            success: true,
            message: 'Branch transfers fetched successfully',
            data: branchTransfers,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error. Please try again.',
            error: error.message,
        });
    }
};