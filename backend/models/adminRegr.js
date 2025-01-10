const mongoose = require('mongoose');

const AdminsignUpSchema = new mongoose.Schema({
  fullname: String,
  user_id: String,
  email: String,
  password: String,
});

const AdminRegister = mongoose.model('AdminRegister', AdminsignUpSchema);

module.exports = AdminRegister;
