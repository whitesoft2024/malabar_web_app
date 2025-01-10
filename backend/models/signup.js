const mongoose = require('mongoose');

const signUpSchema = new mongoose.Schema({
  fullname: String,
  user_id: String,
  branch_name: String,
  branchCode: String,
  designation: String,
  email: String,
  password: String,
});

const EmployeeRegister = mongoose.model('EmployeeRegister', signUpSchema);

module.exports = EmployeeRegister;
