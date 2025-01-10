const RDS = require('../models/rdsMain');
const CounterModel = require("../models/counterSchema");

const incrementRDSFiveDigits = (RDSNumber) => {
  return RDSNumber.replace(/\d{5}$/, function (match) {
    return (parseInt(match) + 1).toString().padStart(5, '0');
  });
};
const incrementRDSEightDigits = (rdsBill) => {
  return rdsBill.replace(/\d{8}$/, function (match) {
    return (parseInt(match) + 1).toString().padStart(8, '0');
  });
};
const incrementRDSFourteenDigits = (transactionId) => {
  return transactionId.replace(/\d{14}$/, function (match) {
    return (parseInt(match) + 1).toString().padStart(14, '0');
  });
};
//emi
const incrementEmiDRDSEightDigits = (depositRdsBill) => {
  return depositRdsBill.replace(/\d{8}$/, function (match) {
    return (parseInt(match) + 1).toString().padStart(8, '0');
  });
};
const incrementEmiWRDSEightDigits = (withdrawRdsBill) => {
  return withdrawRdsBill.replace(/\d{8}$/, function (match) {
    return (parseInt(match) + 1).toString().padStart(8, '0');
  });
};
const incrementEmiWRDSFourteenDigits = (withdrawTransactionId) => {
  return withdrawTransactionId.replace(/\d{14}$/, function (match) {
    return (parseInt(match) + 1).toString().padStart(14, '0');
  });
};
const incrementEmiDRDSFourteenDigits = (depositTransactionId) => {
  return depositTransactionId.replace(/\d{14}$/, function (match) {
    return (parseInt(match) + 1).toString().padStart(14, '0');
  });
};
//=============================================================================

exports.create = async (req, res) => {
  try {

    const counter = await CounterModel.findOneAndUpdate(
      { _id: "rdsval" },
      { '$inc': { 'seq': 1 } },
      { new: true, upsert: true }
    );
    console.log("rdsbill",req.body.rdsBill);
    const branchCode = req.body.RDSNumber.slice(3, 6);

    const lastRDSNumber = await RDS.findOne({ RDSNumber: { $regex: `^RDS${branchCode}` } }).sort({ RDSNumber: -1 }).limit(1);
    const lastRDSBill = await RDS.findOne({ rdsBill: { $regex: `^DRDS${branchCode}` } }).sort({ rdsBill: -1 }).limit(1);
    const lastRDSTransactionId = await RDS.findOne({ transactionId: { $regex: `^TRDS` } }).sort({ transactionId: -1 }).limit(1);

    let newRDSNumber;
    let newRDSBill;
    let newRDSTransactionId;
    if (lastRDSNumber) {
      console.log(lastRDSNumber);
      newRDSNumber = incrementRDSFiveDigits(lastRDSNumber.RDSNumber);
    } if (lastRDSBill) {
      console.log(lastRDSBill);
      newRDSBill = incrementRDSEightDigits(lastRDSBill.rdsBill);
    } if (lastRDSTransactionId) {
      console.log(lastRDSTransactionId);
      newRDSTransactionId = incrementRDSFourteenDigits(lastRDSTransactionId.transactionId);
    }
    if (!lastRDSNumber) {
      newRDSNumber = `RDS${branchCode}00001`;
    }
    if (!lastRDSBill) {
      newRDSBill = `DRDS${branchCode}00000001`;
    }
    if (!lastRDSTransactionId) {
      newRDSTransactionId = `TRDS00000000000001`;
    }

    const newRDSdata = new RDS({
      ...req.body,
      RDSNumber: newRDSNumber,
      rdsBill: newRDSBill,
      transactionId: newRDSTransactionId,
      sl_no: counter.seq
    });

    await newRDSdata.save();
    res.status(200).json({ message: 'RDS details uploaded successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createPost = async (req, res) => {
  const { _id } = req.body;
  const emiData = req.body;

  const branchCode = emiData.branchCode;
  console.log("BranchCode: " + branchCode);

  try {
    // Find the RDS document by _id
    const rdsDocument = await RDS.findById(_id);

    if (!rdsDocument) {
      return res.status(404).json({ message: 'RDS document not found' });
    }

    // Find the last transactionId and bills within the EmiData array across all documents
    const lastDepositRDSBillDoc = await RDS.aggregate([
      { $unwind: "$EmiData" },
      { $match: { "EmiData.depositRdsBill": { $regex: `^EDRDS${branchCode}` } } },
      { $sort: { "EmiData.depositRdsBill": -1 } },
      { $limit: 1 },
      { $project: { "EmiData.depositRdsBill": 1 } }
    ]);

    const lastWithdrawRDSBillDoc = await RDS.aggregate([
      { $unwind: "$EmiData" },
      { $match: { "EmiData.withdrawRdsBill": { $regex: `^EWRDS${branchCode}` } } },
      { $sort: { "EmiData.withdrawRdsBill": -1 } },
      { $limit: 1 },
      { $project: { "EmiData.withdrawRdsBill": 1 } }
    ]);

    const lastDepositRDSTransactionIdDoc = await RDS.aggregate([
      { $unwind: "$EmiData" },
      { $match: { "EmiData.depositTransactionId": { $regex: `^ETRDS` } } },
      { $sort: { "EmiData.depositTransactionId": -1 } },
      { $limit: 1 },
      { $project: { "EmiData.depositTransactionId": 1 } }
    ]);

    const lastWithdrawRDSTransactionIdDoc = await RDS.aggregate([
      { $unwind: "$EmiData" },
      { $match: { "EmiData.withdrawTransactionId": { $regex: `^ETRDS` } } },
      { $sort: { "EmiData.withdrawTransactionId": -1 } },
      { $limit: 1 },
      { $project: { "EmiData.withdrawTransactionId": 1 } }
    ]);

    const lastDepositRDSBill = lastDepositRDSBillDoc.length ? lastDepositRDSBillDoc[0].EmiData.depositRdsBill : null;
    const lastWithdrawRDSBill = lastWithdrawRDSBillDoc.length ? lastWithdrawRDSBillDoc[0].EmiData.withdrawRdsBill : null;
    const lastDepositRDSTransactionId = lastDepositRDSTransactionIdDoc.length ? lastDepositRDSTransactionIdDoc[0].EmiData.depositTransactionId : null;
    const lastWithdrawRDSTransactionId = lastWithdrawRDSTransactionIdDoc.length ? lastWithdrawRDSTransactionIdDoc[0].EmiData.withdrawTransactionId : null;

    let newDepositRDSBill = lastDepositRDSBill ? incrementEmiDRDSEightDigits(lastDepositRDSBill) : `EDRDS${branchCode}00000001`;
    let newWithdrawRDSBill = lastWithdrawRDSBill ? incrementEmiWRDSEightDigits(lastWithdrawRDSBill) : `EWRDS${branchCode}0000000001`;
    let newDepositRDSTransactionId = lastDepositRDSTransactionId ? incrementEmiDRDSFourteenDigits(lastDepositRDSTransactionId) : `ETRDS00000000000001`;
    let newWithdrawRDSTransactionId = lastWithdrawRDSTransactionId ? incrementEmiWRDSFourteenDigits(lastWithdrawRDSTransactionId) : `ETRDS00000000000001`;

    // Conditionally add new values to emiData if they are present in the request body
    if ('depositRdsBill' in req.body) {
      emiData.depositRdsBill = newDepositRDSBill;
    }
    if ('withdrawRdsBill' in req.body) {
      emiData.withdrawRdsBill = newWithdrawRDSBill;
    }
    if ('depositTransactionId' in req.body) {
      emiData.depositTransactionId = newDepositRDSTransactionId;
    }
    if ('withdrawTransactionId' in req.body) {
      emiData.withdrawTransactionId = newWithdrawRDSTransactionId;
    }

    // Push the new EmiData into the EmiData array
    rdsDocument.EmiData.push(emiData);

    // Save the updated RDS document
    const updatedRDS = await rdsDocument.save();

    res.status(200).json(updatedRDS); // Send back the updated document as response
  } catch (error) {
    console.error('Error adding EmiData to RDS document:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getAll = async (req, res) => {
  try {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const branchCode = req.query.branch;
    const searchTerm = req.query.searchTerm;
    const searchReceipt = req.query.searchReceipt;
    const searchRDS = req.query.searchRDS;
    const date = req.query.date;
    const fromDate = req.query.fromDate;
    const toDate = req.query.toDate;
    let query = {};

    if (branchCode) {
      query.RDSNumber = { $regex: new RegExp(`^.{3}${branchCode}`) };
    }

    if (searchTerm) {
      const searchTermRegex = new RegExp(searchTerm, 'i');
      query.$or = [
        { customerName: searchTermRegex },
        { RDSNumber: searchTermRegex },
        { customerNumber: searchTermRegex },
        { newDate: searchTermRegex },
        { 'EmiData.Date': searchTermRegex }
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

    if (date) {
      const searchRDSRegex = new RegExp(date, 'i');
      query.$or = [
        { newDate: searchRDSRegex },
        { 'EmiData.Date': searchRDSRegex }
      ];
    }

    if (fromDate && toDate) {
      query.$and = [
        {
          $or: [
            { newDate: { $gte: fromDate, $lte: toDate } },
            { 'EmiData.Date': { $gte: fromDate, $lte: toDate } },
          ]
        }
      ];
    }

    // Fetch data with or without pagination
    let data;
    let total;
    if (page && limit) {
      total = await RDS.countDocuments(query);
      data = await RDS.find(query)
        .sort({ RDSNumber: 1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .exec();

      let nextPage = null;
      if (total > page * limit) {
        nextPage = page + 1;
      }

      res.json({ data, nextPage, total });
    } else {
      data = await RDS.find(query)
        .sort({ RDSNumber: 1 })
        .exec();

      res.json({ data });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateRds = async (req, res) => {
  const { RDSNumber } = req.params; // Get the ID from the request params
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

exports.createWithdraw = async (req, res) => {
  try {
    const { id } = req.params;

    const { emiData } = req.body;

    console.log(req.params, "params");
    console.log(emiData, "groupId");
    console.log(req.body, "req.body");

    const rdsDocument = await RDS.findById(id);

    if (!rdsDocument) {
      return res.status(404).json({ message: 'RDS document not found' });
    }

    // Add the new EMI entry to the found loan form
    // rdsDocument.EmiData.push({
    //   newDate,transactionId,withdrawalAmount,referenceName,User,userTime,branchCode,Type // Incrementing the emiNumber
    // });
    rdsDocument.EmiData.push(emiData);

    // Save the updated loan form document
    await rdsDocument.save();

    res.status(200).json({ success: true, message: 'Withdraw successfully', data: rdsDocument });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};
