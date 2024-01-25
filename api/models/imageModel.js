const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const imageModel = new mongoose.Schema({
    userID: {
        type: ObjectId
    },
    title: {
        type: String,
    },
    link: {
        type: String
    }
}, {timestamps: true});

module.exports = mongoose.model("images", imageModel);