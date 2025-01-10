const express = require('express')

const router = express.Router()

const bankTransactionController = require('../controllers/bankTransactionController')

//Route to post all bank transactions
router.post('/banktra', bankTransactionController.create)

//Route to get all bank transactions
router.get('/banktra', bankTransactionController.getAll)

module.exports = router
 