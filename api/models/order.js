const mongoose = require('mongoose');
const orderModel = new mongoose.Schema({
    userId: {
        type: String,
    },
    fileName: {
        type: String,
    },
    price: {
        type: Number,
        default: 0
    },

}, {timestamps: true});

module.exports = mongoose.model("order", orderModel);

