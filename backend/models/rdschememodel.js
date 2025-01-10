const mongoose = require('mongoose')


const rdschema =({
    commissionPercentageAfter: { type: Number },
    commissionPercentageBefore: { type: Number },
    durationMonth: { type: Number },
    durationYear: { type: Number },
    interest: { type: Number },
    interestCutAfter: { type: Number },
    interestCutBefore: { type: Number },
    schemeType: { type: String },
    amount: { type: String },
    finalAmount: {type:Number},

  });

  const  rdschemadata =mongoose.model("rdschemadata",rdschema)

  module.exports=rdschemadata;