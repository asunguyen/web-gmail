const mongoose = require('mongoose');
const thueGmailModel = new mongoose.Schema({
    userID: {
        type: String
    },
    mail: {
        type: String,
        require: true,
    },
    token: {
        type: String
    },
    brand: {
        type: String
    },
    otp: {
        type: String,
    },
    status: {
        type: String
    },
    amount: {
        type: Number
    }

}, {timestamps: true});

module.exports = mongoose.model("thuemail", thueGmailModel);

