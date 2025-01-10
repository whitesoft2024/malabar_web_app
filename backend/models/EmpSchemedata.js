const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  
employeeName: { type: Number },
employeeAddress: { type: Number },
branchName: { type: Number },
branchCode: { type: Number },
designation: { type: Number },
joinDate: { type: Number },
mobile: { type: Number },
alternateMobile: { type: String },
employeeId: { type: String },
document1: { type: String },
document2: { type: String },
document3: { type: String },
signature: { type: String },
});

const employeeSchemedata = mongoose.model("employeeSchemedata", employeeSchema);

module.exports = employeeSchemedata;
