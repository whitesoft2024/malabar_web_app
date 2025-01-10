const express = require('express');
const router = express.Router();
const authController = require('../controllers/loginController');

router.post('/login', authController.login);
router.post('/verify-otp', authController.verifyOtps);

module.exports = router;
