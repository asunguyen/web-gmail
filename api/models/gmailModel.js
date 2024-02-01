const mongoose = require('mongoose');
const gmailModel = new mongoose.Schema({
    mail: {
        type: String,
        require: true,
    },
    handle: {
        type: Number,
        default: 1
    },
    checkLive: {
        type: Number,
        default: 1
    },
    regDone: {
        type: Object,
        default: []
    },
    status: {
        type: Boolean,
        default: false
    },
    timeUpdate: {
        type: String,
    },
    otp: {
        type: String,
    }

}, {timestamps: true});

module.exports = mongoose.model("gmailModel", gmailModel);

