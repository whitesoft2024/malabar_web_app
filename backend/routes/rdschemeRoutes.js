const express =require('express')
const router =express.Router()
const  RDschemaController =require('../controllers/RdSchemaController')

router.post('/auth/rdscheme',RDschemaController.create)

module.exports =router;
