const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const postModel = new mongoose.Schema({
    categoryID: {
        type: String,
    },
    userID: {
        type: String,
        require: true
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
    thumbnail: {
        type: String
    }
}, {timestamps: true});

module.exports = mongoose.model("posts", postModel);

