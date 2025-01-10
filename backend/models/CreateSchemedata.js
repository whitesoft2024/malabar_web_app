const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
    si_no: { type: Number },
    employeeName: { type: String },
    employeeAddress: { type: String },
    branch_name: { type: String },
    branchCode: { type: String },
    designation: { type: String },
    joinDate: { type: String },
    mobile: { type: String },
    alternativeMobile: { type: String },
    employeeId: { type: String },
    document1: { type: String },
    document2: { type: String },
    document3: { type: String },
    signatureImage: { type: String },
});

// Middleware function to add serial number before saving
employeeSchema.pre('save', async function(next) {
    try {
      if (!this.si_no) {
        // Check if serial number already exists
        const lastMembership = await employeeSchemedata.findOne({}, {}, { sort: { 'si_no': -1 } });
        const lastSiNo = lastMembership ? lastMembership.si_no : 0;
        this.si_no = lastSiNo + 1; // Increment serial number
      }
      next();
    } catch (error) {
      next(error);
    }
  });

const employeeSchemedata = mongoose.model("employeeSchemedata", employeeSchema);

module.exports = employeeSchemedata;
