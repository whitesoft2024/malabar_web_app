const mongoose = require('mongoose');


const branchSchema = new mongoose.Schema({
    bankName: String,
    ifseCode: String,
    branch_name: String,
    branchCode: String,
    state: String,
    address:String,
    phoneNumber:String,
    landLine:String,
  });
  
  const Branch = mongoose.model('Branch',branchSchema);
  
  module.exports = Branch;  