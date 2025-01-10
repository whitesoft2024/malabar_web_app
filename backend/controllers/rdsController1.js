const RDS = require('../models/rdsMain');
const RDSHistory = require('../models/rdsProducts');
const CounterModel = require("../models/counterSchema");

const incrementRDSFiveDigits = (RDSNumber) => {
  return RDSNumber.replace(/\d{5}$/, function (match) {
    return (parseInt(match) + 1).toString().padStart(5, '0');
  });
};

exports.create = async (req, res) => {
  try {

    const counter = await CounterModel.findOneAndUpdate(
      { _id: "rdsval" },
      { '$inc': { 'seq': 1 } },
      { new: true, upsert: true }
    );
    const branchCode = req.body.RDSNumber.slice(3, 6);
    console.log(branchCode);
    const lastRDSNumber = await RDS.findOne({ RDSNumber: { $regex: `^RDS${branchCode}` } }).sort({ RDSNumber: -1 }).limit(1);

    let newRDSNumber;
    if (lastRDSNumber) {
      console.log(lastRDSNumber);
      newRDSNumber = incrementRDSFiveDigits(lastRDSNumber.RDSNumber);
    } else {
      newRDSNumber = `RDS${branchCode}00001`;
    }

    const newRDSdata = new RDS({
      ...req.body,
      RDSNumber: newRDSNumber,
      sl_no: counter.seq
    });

    await newRDSdata.save();
    res.status(200).json({ message: 'RDS details uploaded successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const page = parseInt(req.query.currentHisPage) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const branchCode = req.query.branch;
    const searchTerm = req.query.searchTerm;
    const searchReceipt = req.query.searchReceipt;
    const searchRDS =req.query.searchRDS;

    let query = {};

    if (branchCode) {
      query.RDSNumber = { $regex: new RegExp(`^.{3}${branchCode}`) };
    }

    if (searchTerm) {
      const searchTermRegex = new RegExp(searchTerm, 'i');
      query.$or = [
        { customerName: searchTermRegex },
        { RDSNumber: searchTermRegex },
        { customerNumber: searchTermRegex }
      ];
    }

    if (searchReceipt) {
      const searchReceiptRegex = new RegExp(searchReceipt, 'i');
      query.$or = [
        { customerName: searchReceiptRegex },
        { customerNumber: searchReceiptRegex }
      ];
    }
    if (searchRDS) {
      const searchRDSRegex = new RegExp(searchRDS, 'i');
      query.$or = [
        { RDSNumber: searchRDSRegex }
      ];
    }

    const total = await RDS.countDocuments(query);
    const data = await RDS.find(query)
      .sort({ RDSNumber: 1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

      

    
    let nextPage = null;
    if (total > page * limit) {
      nextPage = page + 1;
    }

    res.json({ data, nextPage, total });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

exports.getHistory = async (req, res) => {
  try {
    const page = parseInt(req.query.currentHisPage) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const branchCode = req.query.branch;
    const searchTerm = req.query.searchHisTerm;
  
    let query = {};
  
    if (branchCode) {
      query.RDSNumber = { $regex: new RegExp(`^.{3}${branchCode}`) };
    }
    // console.log("branchcode",branchCode)
  
    if (searchTerm) {
      const searchTermRegex = new RegExp(searchTerm, 'i');
      query.$or = [
        // { customerName: searchTermRegex },
        { RDSNumber: searchTermRegex },
        // { customerNumber: searchTermRegex }
      ];
    }
  
    const total = await RDSHistory.countDocuments(query);
    const data = await RDSHistory.find(query)
      .sort({ RDSNumber: 1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

      // Calculate balance for each account
      const accountsWithBalance = {};
      data.forEach(transaction => {
          const { accountNumber, action, amount, newAmount, withdrawalAmount } = transaction;
          let amountFloat = 0;
          if (newAmount !== undefined) {
              amountFloat = parseFloat(newAmount);
          } else if (withdrawalAmount !== undefined) {
              amountFloat = parseFloat(withdrawalAmount);
          } else {
              amountFloat = parseFloat(amount);
          }
          if (!accountsWithBalance[accountNumber]) {
              accountsWithBalance[accountNumber] = [];
          }
          const prevBalance = accountsWithBalance[accountNumber].length > 0 ? accountsWithBalance[accountNumber][accountsWithBalance[accountNumber].length - 1].balance : 0;
          const balance = action === 'deposit' ? prevBalance + amountFloat : prevBalance - amountFloat;
          accountsWithBalance[accountNumber].push({ ...transaction.toObject(), balance });
      });
      

// Convert accountsWithBalance to array for easier serialization
const dataArray = Object.values(accountsWithBalance).flat();
   

    let nextPage = null;
    if (total > page * limit) {
      nextPage = page + 1;
    }
  
    res.json({ data: dataArray, nextPage, total });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

 // Update the rds entry with the provided ID
 exports.updateRds = async (req, res) => {
  const  { RDSNumber } = req.params; // Get the ID from the request params
  // const { customerNumber } = req.body; // Get the updated customer number from the request body
  const updatedFields = req.body;

  try {
    const updatedRds = await RDS.findOneAndUpdate(
      { RDSNumber }, // Find rds entry by ID
      // { customerNumber }, // Update the customer number
      { ...updatedFields },
      { new: true } // Return the updated document
    );

    if (!updatedRds) {
      return res.status(404).json({ message: 'RDS entry not found' });
    }

    res.status(200).json(updatedRds); // Send back the updated rds entry
  } catch (error) {
    console.error('Error updating RDS entry:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.createPost= async (req, res) => {
  const { id } = req.params; // Get the _id from the request parameters
  const emiData = req.body; // Assuming the request body contains the EmiData to add

  try {
    // Find the RDS document by _id
    const rdsDocument = await RDS.findById(id);

    if (!rdsDocument) {
      return res.status(404).json({ message: 'RDS document not found' });
    }

    // Push the new EmiData into the EmiData array
    rdsDocument.EmiData.push(emiData);

    // Save the updated document
    const updatedRDS = await rdsDocument.save();

    res.status(200).json(updatedRDS); // Send back the updated document as response
  } catch (error) {
    console.error('Error adding EmiData to RDS document:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};