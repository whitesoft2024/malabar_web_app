const express = require('express')

const router = express.Router()

const receiptLedgerController = require('../controllers/receiptLedgerController')

// Route to post all payment ledger
router.post('/recled', receiptLedgerController.create)

//Route to get all expenses
router.get('/recled', receiptLedgerController.getAll)

router.get('/receiptLedger', receiptLedgerController.getReciptByDate)

// Route to check if a voucher number is unique
router.get('/recled/check-voucher-number/:voucherNumber', receiptLedgerController.checkVoucherNumber);

module.exports = router