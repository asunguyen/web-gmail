const mongoose = require('mongoose');
const gmailModel = new mongoose.Schema({
    pass: {
        type: String
    },
    mail: {
        type: String,
        require: true,
    },
    time: {
        type: String,
    },
    token: {
        type: String
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

module.exports = mongoose.model("gmail", gmailModel);

