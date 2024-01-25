const authMiddl = require("../middlewares/authmidd");
const ImageModel = require("../models/imageModel");
const fs = require('fs');
const path = require('path');
const upload = require("../middlewares/uploadMiddleware");
const { ObjectId } = require("mongodb");
const uploadController = {
    getlist: async (req, res) => {
        try {
            const page = req.query.page || 0;
            const search = req.query.search || "";
            const size = req.query.size || 20;
            const total = await ImageModel.countDocuments();
            const listImage = await ImageModel.find().limit(size).skip(page * size);
            res.json({ code: 200, data: listImage, total: total });
        } catch (err) {
            res.json({ code: 500, error: err });
        }
        
    },
    delete: async(req, res) => {
        try {
            const id = req.body.id;
            const imageDL = await ImageModel.findByIdAndDelete(id);
            res.json({ code: 200, data: imageDL });
        } catch (err) {
            res.json({ code: 500, error: err });
        }
    },
    uploadImage: async (req, res) => {
        authMiddl.verifyToken(req, res, async() => {
            try {
                const folder = path.join(__dirname, "../images");
                if (!req.file) {
                    res.json({code: 404, error: "Vui lòng gửi file image"});
                    return;
                }
    
                const file = req.file;
                const namefile = new Date().getTime() + file.originalname;
                const size = file.size;
                const mimetype = file.mimetype;
                const bufferData = Buffer.from(file.buffer, file.encoding);
                fs.writeFile(folder + '/' + namefile, bufferData, async (err) => {
                    if (err) {
                        console.log(err);
                        res.json({code: 500, error: err});
                    } else {
                        const newImage = await new ImageModel({
                            userID: new ObjectId(req.user?.id),
                            link:  process.env.uploadUrl + namefile,
                            title: namefile
                        }).save();
                        res.json({code: 200, data: newImage});
                    }
                    
                });
            } catch (err) {
                res.json({ code: 500, error: err });
            }
        })
        
    }

};

module.exports = uploadController;