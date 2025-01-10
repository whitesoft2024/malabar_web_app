const express = require('express')
const router =express.Router()
const gdcsSchemeController=require('../controllers/gdcsController')

router.post('/auth',gdcsSchemeController.create)

module.exports=router;