const mongoose = require('mongoose')

const branchRequestSchema = new mongoose.Schema({
    fromBranch: String,
    toBranch: String,
    amount: String,
    reason: String,
    date: String,
    // status: String,  
})

const BranchRequest = mongoose.model('BranchRequest', branchRequestSchema)

module.exports = BranchRequest
