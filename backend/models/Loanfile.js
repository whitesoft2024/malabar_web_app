const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    loanNo: {
        type: String,
        required: true
    },
    fileType1: String,
    fileType2: String,
    fileType3: String,
    fileData1: {
        type: String,
        required: true
    },
    fileData2: {
        type: String,
        required: true
    },
    fileData3: {
        type: String,
        required: true
    }
});

const LoanFile = mongoose.model('LoanFile', fileSchema);
module.exports = LoanFile;
