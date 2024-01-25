const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const productModel = new mongoose.Schema({
    productTypeID: {
        type: String,
    },
    userID: {
        type: String
    },
    title: {
        type: String,
        require: true,
    },
    status: {
        type: Number,
        default: 1
    },
    description: {
        type: String
    },
    content: {
        type: String
    }, 
    price: {
        type: Number
    },
    priceSale: {
        type: Number
    },
    thumbnail: {
        type: String
    },
    listImage: {
        type: Object
    },
    quantity: {
        type: Number,
        default: 1
    }

}, {timestamps: true});

module.exports = mongoose.model("product", productModel);

