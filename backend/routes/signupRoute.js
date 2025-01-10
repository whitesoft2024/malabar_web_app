const express = require("express");
const signUPController= require("../controllers/signupControls");

const router = express.Router();
// const { AddNewEmployee, VerifyOTPAndAddEmployee } = require('../controllers/employeeController');

// router.get("/addsign", signUPController.getSignUp);



router.post('/add-new-employee',signUPController.AddNewEmployee);
router.post('/verify-otp',signUPController.VerifyOTPAndAddEmployee);


module.exports = router;