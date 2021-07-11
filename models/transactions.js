// This is the MongoDB Schema File.

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const transactionSchema = new Schema({
    sender : {
        type : String,
        required : true
    },
    receiver : {
        type : String,
        required : true
    },
    amount : {
        type : Number,
        required : true
    },
    time : {
        type: Number,
        required: true,
        default: (new Date()).getTime()
    }
}, {timestamps: true});

const Transaction = mongoose.model('Transaction', transactionSchema);
module.exports = Transaction;