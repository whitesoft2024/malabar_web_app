const express = require('express');

const router = express.Router();

const branchRequestController = require('../controllers/branchRequestController');

// Route to post all branch requests
router.post('/breq', branchRequestController.create);

// Route to fetch all branch requests
router.get('/breq', branchRequestController.getAll);

module.exports = router;
