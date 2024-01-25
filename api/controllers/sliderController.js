const authMiddl = require("../middlewares/authmidd");
const SliderModel = require("../models/sliderModel");
const sliderController = {
    create: async(req, res) => {
        authMiddl.verifyToken(req, res, async() => {
            try {
                const title = req.body.title;
                const description = req.body.description;
                const image = req.body.image;
                const textButton = req.body.textButton;
                const linkButton = req.body.linkButton;

                const itemSl = await new SliderModel({
                    title: title,
                    description: description,
                    image: image,
                    textButton: textButton,
                    linkButton: linkButton
                }).save();
                res.json({code: 200, data: itemSl});
            }catch(err) {
                res.json({code: 500, error: err});
            }
        }) 
    },
    update: async(req, res) => {
        authMiddl.verifyToken(req, res, async() => {
            try {
                const title = req.body.title;
                const description = req.body.description;
                const image = req.body.image;
                const textButton = req.body.textButton;
                const linkButton = req.body.linkButton;
                const id = req.body.id;
                const itemSlUD = await SliderModel.findById(id);
                if (itemSlUD && itemSlUD._id) {
                    const itemSl = await SliderModel.findByIdAndUpdate(id, {
                        title: title || itemSlUD.title,
                        description: description || itemSlUD.description,
                        image: image || itemSlUD.image,
                        textButton: textButton || itemSlUD.textButton,
                        linkButton: linkButton || itemSlUD.linkButton
                    });
                    res.json({code: 200, data: itemSl});
                } else {
                    res.json({code: 404, error: "Không tìm thấy item slider có id: "+ id});
                }
                
            }catch(err) {
                res.json({code: 500, error: err});
            }
        }) 
    },
    getAll: async(req, res) => {
        try {
            const listSL = await SliderModel.find();
            res.json({code: 200, data: listSL});
        }catch(err) {
            res.json({code: 500, error: err});
        }
    },
    delete: async(req, res) => {
        try {
            const id = req.body.id;
            const itemSl = await SliderModel.findByIdAndDelete(id);
            res.json({code: 200, data: itemSl});
        }catch(err) {
            res.json({code: 500, error: err});
        }
    }
};

module.exports = sliderController;