// models/Group.js
const mongoose = require('mongoose');

const GroupSchema = new mongoose.Schema({

 GroupName:{
   type: String,
    required: true,
 },
 auctionSlabPercent:{
   type: Number,
    required: true,
 },
 companyComisionPercentage:{
   type: Number,
    required: true,
 },
 priceMoney:{
   type: Number,
    required: true,
 },
 schemeAmount:{
   type: Number,
    required: true,
 },
 duration:{
   type: String,
    required: true,
 },
 numberofMember:{
   type: Number,
    required: true,
 },
 schemeType: {
   type: String,
    required: true,
 },
 currentDate:{
   type: String,
    required: true,
 },
 emi:{
  type: Number,
    required: true,
 },
 branchCode:{
  type:String,

 },
 members:[
    {
      customerName: String,
      phoneNumber: String,
      membershipId: String,
      groupName: String,
      GDCSNumber:String,
      numberofMembers: String,
      referenceName: String,
      date: String,
      transactionId: String,
      billNumber: String,
      amount: Number,
      amountInWords: String,
      benefeciaryName: String,
      paymentMode: String,
      accountNumber: String,
      ifsc: String,
      bankName: String,
      monthlyEmi: [
        {
          emiNumber: Number, // This will help identify the EMI entry (1, 2, 3, etc.)
          date: String, // Date when the EMI is due
          emiAmount: Number, // Amount of the EMI
          dividend: Number, // Dividend amount
          payableAmount: Number, // Total payable amount including EMI and dividend
        },
      ],
    }
 ],
});

module.exports = mongoose.model('Group', GroupSchema);
