const express = require('express')
const router = express.Router()
const paymentLedgerController = require('../controllers/paymentLedgerController')

// Route to post all payment ledger
router.post('/payled', paymentLedgerController.create)

//Route to get all expenses
router.get('/payled', paymentLedgerController.getAll)
// Route to get a specific expense by
router.get('/payLedger', paymentLedgerController.getReciptByDate)

// Route to check if a voucher number is unique
router.get('/payled/check-voucher-number/:voucherNumber', paymentLedgerController.checkVoucherNumber);

module.exports = router
