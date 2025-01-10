const BranchRequest = require('../models/branchRequestModel');

// Create and Save a new Branch Request
exports.create = async (req, res) => {
    const newBranchRequest = new BranchRequest(req.body);
    try {
        const savedBranchRequest = await newBranchRequest.save();
        res.status(201).json({
            success: true,
            message: 'Money request send to head office',
            BranchRequest: savedBranchRequest,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error. Please try again.',
            error: error.message,
        });
    }
};

//Fetch all branch requests
exports.getAll = async (req, res) => {
    try {
        const branchRequests = await BranchRequest.find({});
        res.status(200).json({
            success: true,
            message: 'Branch requests fetched successfully',
            data: branchRequests,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error. Please try again.',
            error: error.message,
        });
    }
};
