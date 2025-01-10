const express = require('express')

const router = express.Router()

const expenseBookController = require('../controllers/expenseBookController')

// // Route to post all expenses
// router.post('/exp', expenseBookController.create)

// //Route to get all expenses
// router.get('/exp', expenseBookController.getAll)

// router.get('/Expense', expenseBookController.getExpensesByDate)

// // Route to check if a voucher number is unique
// router.get('/exp/check-voucher-number/:voucherNumber', expenseBookController.checkVoucherNumber);




//expense book entry
router.post('/create-entry', expenseBookController.createExpenseBookEntry);
router.post('/add-expense-detail/:id', expenseBookController.addExpenseDetail); // Notice the :id parameter for capturing the ExpenseBook ID
router.get('/expenses-by-branch-code',expenseBookController.getExpensesByBranchCode); // New route for fetching expenses by branchCode

module.exports = router
