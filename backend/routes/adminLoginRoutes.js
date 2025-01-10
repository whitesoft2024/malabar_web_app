const express = require("express");
const router = express.Router();
// const { adminLogin } = require("../controllers/adminLoginController");
const adminController = require('../controllers/adminLoginController');

// Admin login route
router.post("/admin", adminController.adminLogin);


// Admin OTP verification route
router.post('/verify-admin-otp', adminController.verifyAdminOtp);

module.exports = router;
