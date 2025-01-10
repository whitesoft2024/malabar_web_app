const express = require('express');

const router = express.Router();

const adminTransferController = require('../controllers/adminTransferController')

// Route to post all branch requests
router.post('/atra', adminTransferController.create)

// Route to fetch all branch requests
router.get('/atra', adminTransferController.getAll)

module.exports = router