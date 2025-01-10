// routes/userRoutes.js

const express = require("express");
const signUPController1 = require("../controllers/safvancontroller");

const router = express.Router();


router.post("/createuser", signUPController1.AddNewEmployee1);
// router.put("/updatepassword", signUPController1.Updatepaasowrd); // New route for updating password
router.post("/requestpasswordupdate", signUPController1.requestPasswordUpdate);

// Route to verify OTP and update the password
router.post("/verifyotpandupdatepassword", signUPController1.verifyOtpAndUpdatePassword);

module.exports = router;
