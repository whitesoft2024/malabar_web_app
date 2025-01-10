// routes/closingDenominationRoutes.js
const express = require('express');
const router = express.Router();
const closingBalanceController = require('../controllers/closingBalanceController');

router.post('/closing-balance', closingBalanceController.create);

router.get('/closinBalance', closingBalanceController.getAll);

// Route for fetching closing denomination data by date and branch code
// router.get('/', closingdenoController.getClosingDenominationByDateAndBranch);

module.exports = router;