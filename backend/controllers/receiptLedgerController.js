const ReceiptLedger = require('../models/receiptLedgerModel')

// Create and Save a new receipt ledger
exports.create = async (req, res) => {
    const newReceiptLedger = new ReceiptLedger(req.body)
    try {
        const savedReceiptLedger = await newReceiptLedger.save()
        res.status(201).json({
            success: true,
            message: 'Receipt ledger sheet created successfully',
            ExpenseBook: savedReceiptLedger
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error. Please try again.',
            error: error.message,
        })
    }
}

//Fetch all payment ledger
exports.getAll = async (req, res) => {
    try {
        const receiptLedgers = await ReceiptLedger.find({})
        res.status(200).json({
            success: true,
            message: 'Receipt ledger fetched successfully',
            data: receiptLedgers
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error. Please try again',
            error: error.message
        })
    }
}

exports.getReciptByDate = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const branchCode = req.query.branchCode;
        const date = req.query.date;

        console.log('date:', date);
        let query = {};

        if (branchCode) {
            query.branchCode = branchCode;
        }

        if (date) {
            const searchReceiptRegex = new RegExp(date, 'i');
            query.$or = [
              { date: searchReceiptRegex }
            ];
          }

        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        const total = await ReceiptLedger.countDocuments(query);

        const newReceiptdata = await ReceiptLedger.find(query).limit(limit).skip(startIndex);

        let nextPage = null;
        if (endIndex < total) {
            nextPage = page + 1;
        }

        res.json({ data: newReceiptdata, nextPage, total });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error. Please try again',
            error: error.message
        });
    }
};

// Check if a voucher number is unique
exports.checkVoucherNumber = async (req, res) => {
    const voucherNumber = req.params.voucherNumber;
    try {
        const existingReceiptLedger = await ReceiptLedger.findOne({ voucherNumber: voucherNumber });
        if (existingReceiptLedger) {
            // If an expense with the given voucher number exists, return false
            res.status(200).json({ isUnique: false });
        } else {
            // If no expense with the given voucher number exists, return true
            res.status(200).json({ isUnique: true });
        }
    } catch (error) {
        console.error('Error checking voucher number', error);
        res.status(500).json({
            success: false,
            message: 'Server error. Please try again.',
            error: error.message,
        });
    }
};