// routes/closingDenominationRoutes.js
const express = require('express');
const router = express.Router();
const closingdenoController = require('../controllers/closingdenoController');

router.post('/', closingdenoController.createClosingDenomination);

// Route for fetching closing denomination data by date and branch code
router.get('/', closingdenoController.getClosingDenominationByDateAndBranch);

module.exports = router;
