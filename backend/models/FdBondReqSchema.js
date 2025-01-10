// models/FdBond.js
const mongoose = require('mongoose');
const moment = require('moment');

const FdBondReqSchema = new mongoose.Schema({
  fdNumber: { type: String, required: true },
  customerName: { type: String, required: true },
  mobileNumber: { type: String, required: true },
  fdAmount: { type: Number, required: true },
  fdBondPercentage: { type: Number, required: true },
  bondTransferAmount: { type: Number, required: true },
  recipientBankAccount: { type: String, required: true },
  // imageUrl: { type: String }, // URL to the uploaded image
  // image: { type: Buffer,type: String }, // Store image as binary data
  // imageType: {  }, // Store image MIME type
  image: {
    data: Buffer, // Binary data of the image
    contentType: String, // MIME type of the image
  },
  status: { type: String, default: 'pending' },
  branchCode:{type: String},
  branch_name:{type: String},
  branchUser:{type:String},
  Date: { type: String },
  Time: { type: String },
}, { timestamps: true });


FdBondReqSchema.pre('save', function(next) {
  const now = moment();
  this.Date = now.format('DD/MM/YYYY');
  this.Time = now.format('HH:mm:ss');
  next();
});

const FdBondReq = mongoose.model('FdBondReq', FdBondReqSchema);

module.exports = FdBondReq;
