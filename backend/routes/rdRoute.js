const express = require('express');
const router = express.Router();
const RD = require('../controllers/rdController');

// Route definition
router.post('/rd', RD.createRD);

router.post('/add-emi/:id',RD.addEmitoRD)

router.get('/getRDemi',RD.getEMiDetails)

router.get('/getRdDetails',RD.getRDDetails)

router.get('/getRdDetailsPg',RD.getRDdataPg)

router.get('/getRdDetailsByBcode',RD.getRDdataByBcode)




module.exports = router;

