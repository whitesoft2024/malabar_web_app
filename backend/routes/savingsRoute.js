const express = require('express');
const router = express.Router();
const createSavings = require('../controllers/savingsController');

// Route definition
router.post('/savings', createSavings.create);
router.get('/savings', createSavings.getAll);
router.get('/SavingsHistory', createSavings.getHistory);
router.put('/savings/:accountNumber', createSavings.updateSavings);
router.post('/savings/addDeposit', createSavings.createPost);
router.post('/savings/addWithdraw', createSavings.createPost2);


module.exports = router;