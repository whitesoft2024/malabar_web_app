const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  fullname: String,
  phonenumber: String,
  user_id: String,
  email: String,
  password: String,
  branchCode: String,  // Added branchCode
  branchName: String, 
  otp: String, // Add OTP field
  otpExpires: Date
});

const userregister = mongoose.model('user',UserSchema);

module.exports = userregister;
