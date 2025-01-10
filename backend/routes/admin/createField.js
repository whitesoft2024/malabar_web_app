const express =require('express')
const router =express.Router()
const EmployeeSchemeController = require('../../controllers/createScheme.js');

router.post('/api/empoyeeCreate',EmployeeSchemeController.create)

 
module.exports=router;