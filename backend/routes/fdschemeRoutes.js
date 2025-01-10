const express =require('express')
const router =express.Router()
const FDSchemeController = require('../controllers/FdSchemaController');

router.post('/auth/fdScheme',FDSchemeController.create)

 
module.exports=router;