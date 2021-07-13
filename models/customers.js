// This is the MongoDB Schema File for the Collection "Customers".

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const customerSchema = new Schema({
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    mobile : {
        type : Number,
        required : true
    },
    balance : {
        type : Number,
        required : true
    }
}, {timestamps: true});

const Customer = mongoose.model('Customer', customerSchema);
module.exports = Customer;