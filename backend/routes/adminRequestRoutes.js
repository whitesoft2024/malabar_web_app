const express = require('express');

const router = express.Router();

const adminRequestController = require('../controllers/adminRequestController')

// Route to post all branch requests
router.post('/areq', adminRequestController.create)

// Route to fetch all branch requests
router.get('/areq', adminRequestController.getAll)

module.exports = router