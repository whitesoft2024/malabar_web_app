const express = require('express')

const router = express.Router()

const attendanceRegisterController = require('../controllers/attendanceRegisterController')

//Route to post all attendance
router.post('/attendance', attendanceRegisterController.create)

//Route to get all attendance
router.get('/attendance', attendanceRegisterController.getAll)

// Route to update an existing attendance register
router.put('/attendance/:id', attendanceRegisterController.update);

module.exports = router