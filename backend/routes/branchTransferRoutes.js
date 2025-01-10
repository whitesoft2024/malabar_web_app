const express = require('express');

const router = express.Router();

const branchTransferController = require('../controllers/branchTransferController')

router.post('/btra', branchTransferController.create)

router.get('/btra', branchTransferController.getAll)

module.exports = router