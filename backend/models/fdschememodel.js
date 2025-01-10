const mongoose = require("mongoose");

const fdSchema = new mongoose.Schema({
  
  commissionPercentageAfter: { type: Number },
  commissionPercentageBefore: { type: Number },
  durationMonth: { type: Number },
  durationYear: { type: Number },
  interest: { type: Number },
  interestCutAfter: { type: Number },
  interestCutBefore: { type: Number },
  schemeType: { type: String },
});

const fdSchemedata = mongoose.model("fdSchemedata", fdSchema);

module.exports = fdSchemedata;
