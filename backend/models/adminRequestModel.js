const mongoose = require('mongoose')

const adminRequestSchema = new mongoose.Schema({
    fromBranch: String,
    toBranch: String,
    amount: String,
    reason: String,
    date: String,
    // status: String,
})

const AdminRequest = mongoose.model('AdminRequest',adminRequestSchema)

module.exports = AdminRequest