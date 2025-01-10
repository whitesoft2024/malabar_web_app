const mongoose = require('mongoose');


const installmentSchema = new mongoose.Schema({
    amount: Number,
    date: String,
    time:String,
    emiIndex:Number,
    emiAmount:Number,
    emiTotal:Number,
    emiOutstanding:Number
},{ timestamps: true });

const memberSchema = new mongoose.Schema({
    branchCode: String,
    customerName: String,
    customerNumber: String,
    membershipId: String,
    schemeId: String,
    installments: [installmentSchema],
    date: String,
    time:String,
    groupName:String,
    address:String,
    userName:String,
    userDesignation:String,
    referenceName:String,
    totalAmount: { type: Number, default: 50000 }, // Default value of 50000
},{ timestamps: true });


secondPriceSchema=new mongoose.Schema({
    branchCode: String,
    customerName: String,
    customerNumber: String,
    membershipId: String,
    schemeId: String,
    date: String,
    time:String,
    groupName:String,
   
},{ timestamps: true })
thirdPriceSchema=new mongoose.Schema({
    branchCode: String,
    customerName: String,
    customerNumber: String,
    membershipId: String,
    schemeId: String,
    date: String,
    time:String,
    groupName:String
},{ timestamps: true })

const auctionDetailsSchema=new mongoose.Schema({
    // firstPrice:[firstPriceSchema],
        firstPrice: [
        {branchCode: String,
        customerName: String,
        customerNumber: String,
        membershipId: String,
        schemeId: String,
        date: String,
        time:String,
        groupName: String,
        pendingEmiAmount: Number,
        createdAt: { type: Date, default: Date.now }  // Manually adding createdAt for each entry
    }
        ],
    secondPrice:[secondPriceSchema],
    thirdPrice:[thirdPriceSchema]
},{ timestamps: true })

const swarnaNidhiScheme = new mongoose.Schema({
    members: [memberSchema], // Nesting the member-related details inside 'member'
    numberOfMembers: Number,
    numberOfAuctions: Number,
    price: String,
    EMI: Number,
    date: String,
    time:String,
    groupName:String,
    duration:Number,
    groupNumber:String,
    auctionDetails:[auctionDetailsSchema]

},{ timestamps: true });

module.exports = mongoose.model('swarnaNidhiModel', swarnaNidhiScheme);
