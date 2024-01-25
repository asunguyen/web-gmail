const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const productTypeModel = new mongoose.Schema({
    parentID: {
        type: String,
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
    slug: {
        type: String
    }

}, {timestamps: true});

module.exports = mongoose.model("productType", productTypeModel);

