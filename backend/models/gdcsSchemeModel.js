const mongoose=require('mongoose');

const GdcsSchema=new mongoose.Schema({
    schemeName:{type:String},
    schemeAmount:{type:Number},
    numberofMember:{type:Number},
    duration:{type:Number},
    emi:{type:Number},
    companyComisionPercentage:{type:Number},
    priceMoney:{type:Number},
    auctionSlabPercent:{type:Number}
});

const GdschemaData=mongoose.model("GdcsSchema",GdcsSchema);

module.exports = GdschemaData;