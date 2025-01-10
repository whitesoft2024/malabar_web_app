const PaymentLedger = require('../models/paymentLedgerModel')

// Create and Save a new payment ledger
exports.create = async (req, res) => {
    const newPaymentLedger = new PaymentLedger(req.body)
    try {
        const savedPaymentLedger = await newPaymentLedger.save()
        res.status(201).json({
            success: true,
            message: 'Payment ledger sheet created successfully',
            ExpenseBook: savedPaymentLedger
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
        const paymentLedgers = await PaymentLedger.find({})
        res.status(200).json({
            success: true,
            message: 'Payment ledger fetched successfully',
            data: paymentLedgers
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

        console.log('date:', branchCode);
        console.log('date:', date);
        let query = {};

        if (branchCode) {
            query.branchCode = branchCode;
        }

        if (date) {
            const searchPaymentRegex = new RegExp(date, 'i');
            query.$or = [
              { date: searchPaymentRegex }
            ];
          }

        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        const total = await PaymentLedger.countDocuments(query);

        const newPaymentdata = await PaymentLedger.find(query).limit(limit).skip(startIndex);

        let nextPage = null;
        if (endIndex < total) {
            nextPage = page + 1;
        }

        res.json({ data: newPaymentdata, nextPage, total });
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
        const existingPaymentLedger = await PaymentLedger.findOne({ voucherNumber: voucherNumber });
        if (existingPaymentLedger) {
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