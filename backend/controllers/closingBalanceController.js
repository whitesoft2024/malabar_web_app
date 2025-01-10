// controllers/closingDenominationController.js
const Closingbalance = require("../models/closingBalanceModel");

// exports.getAll = async (req, res) => {
//     try {
//         const page = parseInt(req.query.currentPage) || 1;
//         const limit = parseInt(req.query.limit) || 10;
//         const branchCode = req.query.branchCode;
//         const date = req.query.date;

//         // Initialize query object
//         let query = {};

//         if (branchCode) {
//             query.branchCode = branchCode;
//         }

//         // Check if date is provided
//         if (date) {
//             // Parse the date string to a Date object
//             const parsedDate = new Date(date);

//             // Calculate the previous day's date
//             const previousDay = new Date(parsedDate);
//             previousDay.setDate(parsedDate.getDate() - 1);

//             // Format the previous day's date to match the expected format in your database
//             const formattedPreviousDay = previousDay.toISOString().split('T')[0];

//             // Adjust the query to search for records on or after the previous day's date
//             query.date = { $gte: formattedPreviousDay };
//         }

//         const total = await Closingbalance.countDocuments(query);
//         const data = await Closingbalance.find(query)
//            .sort({ date: 1 })
//            .skip((page - 1) * limit)
//            .limit(limit)
//            .exec();

//         let nextPage = null;
//         if (total > page * limit) {
//             nextPage = page + 1;
//         }

//         res.json({ data, nextPage, total });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

// exports.getAll = async (req, res) => {
//     try {
//         const page = parseInt(req.query.currentPage) || 1;
//         const limit = parseInt(req.query.limit) || 10;
//         const branchCode = req.query.branchCode;
//         const date = req.query.date;

//         // Initialize an empty object for the query
//         let query = {};

//         // Adjust the date to represent the previous day
//         if (date) {
//             const dateParts = date.split('/');
//             const adjustedDate = new Date(+dateParts[2], +dateParts[1] - 1, +dateParts[0]);
//             const searchFDRegex = new RegExp(adjustedDate.toISOString().split('T')[0], 'i'); // Convert to YYYY-MM-DD format for regex

//             query.$or = [
//                 { date: searchFDRegex }
//             ];
//         }

//         if (branchCode) {
//             query.branchCode = branchCode;
//         }

//         const total = await Closingbalance.countDocuments(query);
//         const data = await Closingbalance.find(query)
//            .sort({ date: 1 })
//            .skip((page - 1) * limit)
//            .limit(limit)
//            .exec();
//         let nextPage = null;
//         if (total > page * limit) {
//             nextPage = page + 1;
//         }

//         res.json({ data, nextPage, total });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

exports.getAll = async (req, res) => {
    try {
      const page = parseInt(req.query.currentPage) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const branchCode = req.query.branchCode;
      const date = req.query.date;

      let query = {};

      if (branchCode) {
        query.branchCode = branchCode;
      }

      if (date) {
        const searchFDRegex = new RegExp(date, 'i');
        query.$or = [
          { date: searchFDRegex }
        ];
      }

      const total = await Closingbalance.countDocuments(query);
      const data = await Closingbalance.find(query)
        .sort({ date: 1 })
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

exports.create = async (req, res) => {
    try {
        const { date, closingBalance, branchCode, totalCredit, totalDebit } = req.body;
        const existingDocument = await Closingbalance.findOne({ branchCode, date });
        if (existingDocument) {
            return res.status(409).json({ message: 'Closing balance for this branch on the selected date already exists' });
        }
        const newClosingBalance = new Closingbalance({
            date,
            closingBalance,
            branchCode,
            totalCredit,
            totalDebit,
        });
        await newClosingBalance.save();
        res.status(201).json({ message: 'Closing balance saved successfully' });
    } catch (error) {
        console.error('Error saving closing balance:', error);
        res.status(500).json({ message: 'Failed to save closing balance' });
    }
}