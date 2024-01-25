const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const sliderModel = new mongoose.Schema({
    title: {
        type: String,
        require: true
    },
    description: {
        type: String
    },
    image: {
        type: String,
        require: true
    },
    textButton: {
        type: String
    },
    linkButton: {
        type: String
    }
}, {timestamps: true});

module.exports = mongoose.model("sliders", sliderModel);