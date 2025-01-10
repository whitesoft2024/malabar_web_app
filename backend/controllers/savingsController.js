const SavingsData = require("../models/savings");
const CounterModel = require("../models/counterSchema");

const incrementSavFiveDigits = (accountNumber) => {
  return accountNumber.replace(/\d{5}$/, function (match) {
    return (parseInt(match) + 1).toString().padStart(5, "0");
  });
};
const incrementSavEightDigits = (savingsBill) => {
  return savingsBill.replace(/\d{8}$/, function (match) {
    return (parseInt(match) + 1).toString().padStart(8, '0');
  });
};
const incrementSavFourteenDigits = (transactionId) => {
  return transactionId.replace(/\d{14}$/, function (match) {
    return (parseInt(match) + 1).toString().padStart(14, '0');
  });
};
//emi
const incrementDepDSavEightDigits = (depositSavingsBill) => {
  return depositSavingsBill.replace(/\d{8}$/, function (match) {
    return (parseInt(match) + 1).toString().padStart(8, '0');
  });
};
const incrementDepWSavEightDigits = (withdrawSavingsBill) => {
  return withdrawSavingsBill.replace(/\d{8}$/, function (match) {
    return (parseInt(match) + 1).toString().padStart(8, '0');
  });
};
const incrementDepWSavFourteenDigits = (withdrawTransactionId) => {
  return withdrawTransactionId.replace(/\d{14}$/, function (match) {
    return (parseInt(match) + 1).toString().padStart(14, '0');
  });
};
const incrementDepDSavFourteenDigits = (depositTransactionId) => {
  return depositTransactionId.replace(/\d{14}$/, function (match) {
    return (parseInt(match) + 1).toString().padStart(14, '0');
  });
};

// exports.create = async (req, res) => {
//   try {
//     const counter = await CounterModel.findOneAndUpdate(
//       { _id: "SaveVal" },
//       { '$inc': { 'seq': 1 } },
//       { new: true, upsert: true }
//     );

//     const branchCode = req.body.accountNumber.slice(1, 4);
//     console.log("brn",branchCode)
//     const lastFDNumber = await SavingsData.findOne({
//       accountNumber: { $regex: `^S${branchCode}` },
//     })
//       .sort({ accountNumber: -1 })
//       .limit(1);
//       const lastSavingsBill = await SavingsData.findOne({ savingsBill: { $regex: `^DSAV${branchCode}` } }).sort({ savingsBill: -1 }).limit(1);
//       const lastSavingsTransactionId = await SavingsData.findOne({ transactionId: { $regex: `^TSAV` } }).sort({ transactionId: -1 }).limit(1);
  

//     let newUpdateSavNumber;
//     let newSavingsBill;
//     let newSavingsTransactionId;
//     if (lastFDNumber) {
//       newUpdateSavNumber = incrementSavFiveDigits(lastFDNumber.accountNumber);
//     }if(lastSavingsBill){
//       console.log(lastSavingsBill);
//       newSavingsBill = incrementSavEightDigits(lastSavingsBill.savingsBill);
//     }if(lastSavingsTransactionId){
//       console.log(lastSavingsTransactionId);
//       newSavingsTransactionId = incrementSavFourteenDigits(lastSavingsTransactionId.transactionId);

//     } else {
//       newUpdateSavNumber = `S${branchCode}00001`;
//       newSavingsBill = `DSAV${branchCode}00000001`;
//       newSavingsTransactionId = `TSAV00000000000001`
//     }

//     const newSavingsdata = new SavingsData({
//       ...req.body,
//       accountNumber: newUpdateSavNumber,
//       savingsBill: newSavingsBill,
//       transactionId: newSavingsTransactionId,
//       sl_no: counter.seq,
//     });

//     await newSavingsdata.save();
//     res.status(200).json({ message: "Savings details uploaded successfully" });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };
exports.create = async (req, res) => {
  try {
    const counter = await CounterModel.findOneAndUpdate(
      { _id: "SaveVal" },
      { $inc: { 'seq': 1 } },
      { new: true, upsert: true }
    );

    const branchCode = req.body.accountNumber.slice(1, 4);
    console.log("brn",branchCode)
    const lastFDNumber = await SavingsData.findOne({
      accountNumber: { $regex: `^S${branchCode}` },
    })
      .sort({ accountNumber: -1 })
      .limit(1);
    const lastSavingsBill = await SavingsData.findOne({ savingsBill: { $regex: `^DSAV${branchCode}` } }).sort({ savingsBill: -1 }).limit(1);
    const lastSavingsTransactionId = await SavingsData.findOne({ transactionId: { $regex: `^TSAV` } }).sort({ transactionId: -1 }).limit(1);

    let newUpdateSavNumber;
    let newSavingsBill;
    let newSavingsTransactionId;
    if (lastFDNumber) {
      newUpdateSavNumber = incrementSavFiveDigits(lastFDNumber.accountNumber);
    }
    if (lastSavingsBill) {
      console.log(lastSavingsBill);
      newSavingsBill = incrementSavEightDigits(lastSavingsBill.savingsBill);
    }
    if (lastSavingsTransactionId) {
      console.log(lastSavingsTransactionId);
      newSavingsTransactionId = incrementSavFourteenDigits(lastSavingsTransactionId.transactionId);
    }

    if (!newUpdateSavNumber) {
      newUpdateSavNumber = `S${branchCode}00001`;
    }
    if (!newSavingsBill) {
      newSavingsBill = `DSAV${branchCode}00000001`;
    }
    if (!newSavingsTransactionId) {
      newSavingsTransactionId = `TSAV00000000000001`;
    }

    const newSavingsdata = new SavingsData({
      ...req.body,
      accountNumber: newUpdateSavNumber,
      savingsBill: newSavingsBill,
      transactionId: newSavingsTransactionId,
      sl_no: counter.seq,
    });

    await newSavingsdata.save();
    res.status(200).json({ message: "Savings details uploaded successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getAll = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const branchCode = req.query.branchCode;
    const branch = req.query.branch;
    const searchSavings = req.query.searchSavings;
    const searchTerm = req.query.searchTerm;
    const date = req.query.date;
    const fromDate = req.query.fromDate;
    const toDate = req.query.toDate;
    console.log(searchTerm)
    console.log(searchSavings)
    let query = {};

    if (branchCode) {
      query = { accountNumber: { $regex: new RegExp(`^.{1}${branchCode}`) } };
    }

    if (branch) {
      query = { accountNumber: { $regex: new RegExp(`^.{1}${branch}`) } };
    }

    if (searchSavings) {
      const searchSavingsRegex = new RegExp(searchSavings, "i");
      query.$or = [
        { customerName: searchSavingsRegex },
        { accountNumber: searchSavingsRegex },
        { customerNumber: searchSavingsRegex },
        { newDate: searchSavingsRegex },
        { Date: searchSavingsRegex },

      ];
    }
    if (searchTerm) {
      const searchTermRegex = new RegExp(searchTerm, "i");
      query.$or = [
        { customerName: searchTermRegex },
        { accountNumber: searchTermRegex },
        { customerNumber: searchTermRegex },
        { newDate: searchTermRegex },
        { Date: searchTermRegex },

      ];
    }
    // if (date) {
    //   const searchSavingsRegex = new RegExp(date, "i");
    //   query.$or = [{ date: searchSavingsRegex }];
    // }

    // if (date) {
    //   const dateRegex = new RegExp(date, "i");
    //   query.date = dateRegex;
    // }

    if (date) {
      const searchSavingsRegex = new RegExp(date, 'i');
      query.$or = [
        { newDate: searchSavingsRegex },
        { 'transferData.Date': searchSavingsRegex }
      ];
    }

    
    if (fromDate && toDate) {
      // Ensure fromDate and toDate are strings in the DD/MM/YYYY format
      query.$and = [
        { $or: [
          { Date: { $gte: fromDate, $lte: toDate } },
          { 'transferData.Date': { $gte: fromDate, $lte: toDate } },
        ]}
      ];
    }

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const total = await SavingsData.countDocuments(query);

    const newSavedata = await SavingsData.find(query)
    .sort({ accountNumber: 1 })
      .limit(limit)
      .skip(startIndex)
      .exec();

  
    let nextPage = null;
    if (endIndex < total) {
      nextPage = page + 1;
    }

    res.json({ data: newSavedata, nextPage, total });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.updateSavings = async (req, res) => {
  const { accountNumber } = req.params; // Get the ID from the request params
  // const { customerNumber } = req.body; // Get the updated customer number from the request body
  const updatedFields = req.body;

  try {
    const updatedSavings = await SavingsData.findOneAndUpdate(
      { accountNumber }, // Find savings entry by ID
      // { customerNumber }, // Update the customer number
      { ...updatedFields },
      { new: true } // Return the updated document
    );

    if (!updatedSavings) {
      return res.status(404).json({ message: "Savings entry not found" });
    }

    res.status(200).json(updatedSavings); // Send back the updated savings entry
  } catch (error) {
    console.error("Error updating savings entry:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getHistory = async (req, res) => {
  try {
    const page = parseInt(req.query.currentHisPage) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const branchCode = req.query.branch;
    const searchTerm = req.query.searchHisTerm;
    const date = req.query.date;

    let query = {};

    if (branchCode) {
      query.accountNumber = { $regex: new RegExp(`^.{1}${branchCode}`) };
    }
    // console.log("branch",branchCode)
    if (searchTerm) {
      const searchTermRegex = new RegExp(searchTerm, "i");
      query.$or = [
        { customerName: searchTermRegex },
        { accountNumber: searchTermRegex },
        { customerNumber: searchTermRegex },
      ];
    }

    if (date) {
      const dateRegex = new RegExp(date, 'i');
      query.updatedAt = dateRegex;
    }

    const total = await SavingsHistory.countDocuments(query);
    const data = await SavingsHistory.find(query)
      .sort({ accountNumber: 1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    // Calculate balance for each account
    const accountsWithBalance = {};
    data.forEach((transaction) => {
      const { accountNumber, action, amount } = transaction;
      const amountFloat = parseFloat(amount);
      if (!accountsWithBalance[accountNumber]) {
        accountsWithBalance[accountNumber] = [];
      }
      const prevBalance =
        accountsWithBalance[accountNumber].length > 0
          ? accountsWithBalance[accountNumber][
              accountsWithBalance[accountNumber].length - 1
            ].balance
          : 0;
      const balance =
        action === "deposit"
          ? prevBalance + amountFloat
          : prevBalance - amountFloat;
      accountsWithBalance[accountNumber].push({
        ...transaction.toObject(),
        balance,
      });
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
};

exports.createPost= async (req, res) => {
  const { _id } = req.body; 
  const depositData = req.body;
  console.log(depositData);

  const branchCode = depositData.branchCode;
  console.log("BranchCode: " + branchCode);

  
  try {
    // Find the Savings document by _id
    const savingsDocument = await SavingsData.findById(_id);
    
    if (!savingsDocument) {
      return res.status(404).json({ message: 'Savings document not found' });
    }

    // Find the last transactionId and bills within the EmiData array across all documents
    const lastDepositSavingsBillDoc = await SavingsData.aggregate([
      { $unwind: "$transferData" },
      { $match: { "transferData.depositSavingsBill": { $regex: `^EDSAV${branchCode}` } } },
      { $sort: { "transferData.depositSavingsBill": -1 } },
      { $limit: 1 },
      { $project: { "transferData.depositSavingsBill": 1 } }
    ]);

    const lastWithdrawSavingsBillDoc = await SavingsData.aggregate([
      { $unwind: "$transferData" },
      { $match: { "transferData.withdrawSavingsBill": { $regex: `^EWSAV${branchCode}` } } },
      { $sort: { "transferData.withdrawSavingsBill": -1 } },
      { $limit: 1 },
      { $project: { "transferData.withdrawSavingsBill": 1 } }
    ]);

    const lastDepositSavingsTransactionIdDoc = await SavingsData.aggregate([
      { $unwind: "$transferData" },
      { $match: { "transferData.depositTransactionId": { $regex: `^ETSAV` } } },
      { $sort: { "transferData.depositTransactionId": -1 } },
      { $limit: 1 },
      { $project: { "transferData.depositTransactionId": 1 } }
    ]);

    const lastWithdrawSavingsTransactionIdDoc = await SavingsData.aggregate([
      { $unwind: "$transferData" },
      { $match: { "transferData.withdrawTransactionId": { $regex: `^ETSAV` } } },
      { $sort: { "transferData.withdrawTransactionId": -1 } },
      { $limit: 1 },
      { $project: { "transferData.withdrawTransactionId": 1 } }
    ]);

    const lastDepositSavingsBill = lastDepositSavingsBillDoc.length ? lastDepositSavingsBillDoc[0].transferData.depositSavingsBill : null;
    const lastWithdrawSavingsBill = lastWithdrawSavingsBillDoc.length ? lastWithdrawSavingsBillDoc[0].transferData.withdrawSavingsBill : null;
    const lastDepositSavingsTransactionId = lastDepositSavingsTransactionIdDoc.length ? lastDepositSavingsTransactionIdDoc[0].transferData.depositTransactionId : null;
    const lastWithdrawSavingsTransactionId = lastWithdrawSavingsTransactionIdDoc.length ? lastWithdrawSavingsTransactionIdDoc[0].transferData.withdrawTransactionId : null;

    let newDepositSavingsBill = lastDepositSavingsBill ? incrementDepDSavEightDigits(lastDepositSavingsBill) : `EDSAV${branchCode}00000001`;
    let newWithdrawSavingsBill = lastWithdrawSavingsBill ? incrementDepWSavEightDigits(lastWithdrawSavingsBill) : `EWSAV${branchCode}0000000001`;
    let newDepositSavingsTransactionId = lastDepositSavingsTransactionId ? incrementDepDSavFourteenDigits(lastDepositSavingsTransactionId) : `ETSAV00000000000001`;
    let newWithdrawSavingsTransactionId = lastWithdrawSavingsTransactionId ? incrementDepWSavFourteenDigits(lastWithdrawSavingsTransactionId) : `ETSAV00000000000001`;
    // Conditionally add new values to emiData if they are present in the request body
    if ('depositSavingsBill' in req.body) {
      depositData.depositSavingsBill = newDepositSavingsBill;
    }
    if ('withdrawSavingsBill' in req.body) {
      depositData.withdrawSavingsBill = newWithdrawSavingsBill;
    }
    if ('depositTransactionId' in req.body) {
      depositData.depositTransactionId = newDepositSavingsTransactionId;
    }
    if ('withdrawTransactionId' in req.body) {
      depositData.withdrawTransactionId = newWithdrawSavingsTransactionId;
    }
 // Add debug logging to track the new IDs
 console.log("New Deposit Savings Bill: " + newDepositSavingsBill);
 console.log("New Withdraw Savings Bill: " + newWithdrawSavingsBill);
 console.log("New Deposit Savings Transaction ID: " + newDepositSavingsTransactionId);
 console.log("New Withdraw Savings Transaction ID: " + newWithdrawSavingsTransactionId);

    savingsDocument.transferData.push(depositData);
    
    // Save the updated document
    const updatedSavings = await savingsDocument.save();

    res.status(200).json(updatedSavings); // Send back the updated document as response
  } catch (error) {
    console.error('Error adding transferData to Savings document:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
exports.updatePrintedStatus = async (req, res) => {
  const { accountNumber } = req.params;
  const { printedStatus } = req.body;

  try {
    const saving = await SavingsData.findOne({ accountNumber });

    if (!saving) {
      return res.status(404).json({ message: "Account not found" });
    }

    // Update the printedStatus field in transferData
    saving.transferData.forEach(data => {
      data.printedStatus = printedStatus;
    });

    await saving.save();
    res.status(200).json({ message: 'Printed status updated successfully', saving });
  } catch (error) {
    console.error('Error updating printed status:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.createPost2= async (req, res) => {
  const { id } = req.params; 
  const depositData = req.body;
  console.log(depositData);
  try {
    // Find the Savings document by _id
    const savingsDocument = await SavingsData.findById(id);
    
    if (!savingsDocument) {
      return res.status(404).json({ message: 'Savings document not found' });
    }

    savingsDocument.transferData.push(depositData);
    
    // Save the updated document
    const updatedSavings = await savingsDocument.save();

    res.status(200).json(updatedSavings); // Send back the updated document as response
  } catch (error) {
    console.error('Error adding transferData to Savings document:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};