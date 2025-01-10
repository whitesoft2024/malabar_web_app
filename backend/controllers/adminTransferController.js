const AdminTransfer = require('../models/adminTransferModel')

// Create and Save a new Branch Request
exports.create = async (req, res) => {
    const newAdminTransfer = new AdminTransfer(req.body)
    try {
        const savedAdminTransfer = await newAdminTransfer.save()
        res.status(201).json({
            success: true,
            message: 'Money transferred successfully',
            AdminTransfer: savedAdminTransfer,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error. Please try again',
            error: error.message,
        })
    }
}

// Fetch all branch requests
exports.getAll = async (req, res) => {
    try {
        const adminTransfers = await AdminTransfer.find({})
        res.status(200).json({
            success: true,
            message: 'Admin fund transfers fetched successfully',
            data: adminTransfers
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error. Please try again.',
            error: error.message
        })
    }
}