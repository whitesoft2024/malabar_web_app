const express = require('express');
const router = express.Router();
const fdController = require('../controllers/fdController')

// Route definition
router.post('/fd', fdController.createFD);

router.get('/fd', fdController.getAll);

router.get('/fdData', fdController.getAllFdData);

// router.post('/fd/:fdId/withdrawInterest', fdController.withdrawInterest);

router.post('/withdrawInterest/:FDNumber',fdController.withdrawInterest);


router.get('/fdDataS/:branchCode/:FDNumber', fdController.getFdNumbersByBranchAndSearch);
module.exports = router;