const express = require('express');
const router = express.Router();
const  createRDS  = require('../controllers/rdsController');

// Route definition
router.post('/rds', createRDS.create); 
router.get('/RDSdata', createRDS.getAll);
router.put('/rds/:RDSNumber', createRDS.updateRds);
router.post('/rds/addEmiData', createRDS.createPost);
router.post('/rds/WithdrawEmiData/:id', createRDS.createWithdraw);


module.exports = router;


