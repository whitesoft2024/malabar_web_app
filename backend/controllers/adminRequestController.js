const AdminRequest = require('../models/adminRequestModel')

// Create and Save a new Branch Request
exports.create = async (req, res) => {
    const newAdminRequest = new AdminRequest(req.body)
    try {
        const savedAdminRequest = await newAdminRequest.save();
        res.status(201).json({
            success: true,
            message: 'Money request send to the branch',
            AdminRequest: savedAdminRequest
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error. Please try again.',
            error: error.message
        })
    }
}

// Fetch all branch requests
exports.getAll = async (req, res) => {
    try {
        const adminRequests = await AdminRequest.find({})
        res.status(200).json({
            success: true,
            message: 'Admin requests fetched successfully',
            data: adminRequests
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error. Please try again.',
            error: error.message
        })
    }
}
