const FdBond = require('../models/FdBondSchema');
// controllers/fdBondController.js
const FdBondReq = require('../models/FdBondReqSchema');
const FdModel = require('../models/fixedProduct');


// Save FD Bond
exports.saveFdBond = async (req, res) => {
  const { percentage, branchName, branchCode } = req.body;

  try {
    const newFdBond = new FdBond({ percentage, branchName, branchCode });
    await newFdBond.save();
    res.status(201).json({ message: 'FD Bond saved successfully', data: newFdBond });
  } catch (error) {
    res.status(500).json({ message: 'Error saving FD Bond', error });
  }
};


// Get FD Bonds by Branch Code
exports.getFdBondsByBranchCode = async (req, res) => {
  try {
    const { branchCode } = req.query;

    if (!branchCode) {
      return res.status(400).json({ message: 'Branch code is required' });
    }

    // Find FD Bonds by branchCode
    const fdBonds = await FdBond.find({ branchCode });

    // Respond with the data
    res.status(200).json({ data: fdBonds });
  } catch (error) {
    // Handle any errors that occur
    res.status(500).json({ message: 'Error retrieving FD Bonds by branch code', error });
  }
};


// controllers/fdBondController.js
exports.createFdBond = async (req, res) => {
  try {
    const { fdNumber, customerName, mobileNumber, fdAmount, fdBondPercentage, bondTransferAmount, recipientBankAccount, branch_name, branchCode,branchUser } = req.body;
    let image = {};

    if (req.file) {
      image.data = req.file.buffer; // Store the binary data
      image.contentType = req.file.mimetype; // Store the image MIME type
    }

    const newFdBond = new FdBondReq({
      fdNumber,
      customerName,
      mobileNumber,
      fdAmount,
      fdBondPercentage,
      bondTransferAmount,
      recipientBankAccount,
      branch_name,
      branchCode,
      branchUser,
      image
    });

    await newFdBond.save();
    res.status(201).json({ message: 'FD Bond created successfully', data: newFdBond });
  } catch (error) {
    res.status(500).json({ message: 'Error creating FD Bond', error: error.message });
  }
};




exports.getAllFdBonds = async (req, res) => {
  try {
    // Find all documents in the FdBondReq collection
    const fdBonds = await FdBondReq.find().select('-__v'); // Exclude version key

    // Map through the results and convert the image data to a base64 string
    const fdBondsWithBase64Images = fdBonds.map(bond => {
      let imageBase64 = null;
      if (bond.image && bond.image.data) {
        // Convert binary data to base64
        imageBase64 = bond.image.data.toString('base64');
        const imageSrc = `data:${bond.image.contentType};base64,${imageBase64}`;
        return { ...bond._doc, image: imageSrc }; // Add the base64 image string to the bond data
      }
      return { ...bond._doc, image: null }; // Add a null value if no image exists
    });

    // Respond with the modified data
    res.status(200).json({ message: 'FD Bonds retrieved successfully', data: fdBondsWithBase64Images });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving FD Bonds', error: error.message });
  }
};



exports.approveFdBondRequest = async (req, res) => {
  try {
    const { id } = req.params; // Assuming the ID is passed as a route parameter

    // Find the FD Bond request by ID in the FdBondReq collection
    const fdBondRequest = await FdBondReq.findById(id);

    console.log('FD Bond Request:', fdBondRequest);

    if (!fdBondRequest) {
      return res.status(404).json({ message: 'FD Bond request not found' });
    }

    const { fdNumber } = fdBondRequest; // Extract fdNumber from the request
    console.log("fdNumber",fdNumber)

    // Find the matching FDNumber in the FdModel collection
    const fdModelData = await FdModel.findOne({ FDNumber: fdNumber });

    if (!fdModelData) {
      return res.status(404).json({ message: 'FD Number not found in FdModel collection' });
    }

    // Approve the FD Bond request by updating its status
    const updatedFdBond = await FdBondReq.findByIdAndUpdate(
      id,
      { status: 'approved' },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      message: 'FD Bond request approved successfully',
      requestDetails: updatedFdBond,
      fdModelDetails: fdModelData, // Return corresponding details from FdModel collection
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error approving FD Bond request',
      error: error.message,
    });
  }
};




// In controllers/fdBondController.js
exports.getFdDetailsByObjectId = async (req, res) => {
  try {
    const { id } = req.params; // Get objectId from route parameter

    // Find the FD Bond request by ID in the FdBondReq collection
    const fdBondRequest = await FdBondReq.findById(id);
    
    if (!fdBondRequest) {
      return res.status(404).json({ message: 'FD Bond request not found' });
    }

    const { fdNumber } = fdBondRequest; // Get fdNumber from the found FD Bond request
    
    // Find the matching FDNumber in the FdModel collection
    const fdModelData = await FdModel.findOne({ FDNumber: fdNumber });

    if (!fdModelData) {
      return res.status(404).json({ message: 'FD Number not found in FdModel collection' });
    }

    // Respond with the details from the FdModel collection
    res.status(200).json({
      message: 'FD Model details retrieved successfully',
      fdModelDetails: fdModelData,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error retrieving FD Model details',
      error: error.message,
    });
  }
};



