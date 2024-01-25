const authMiddl = require("../middlewares/authmidd");
const ProductModel = require("../models/productModel");

const postController = {
    getAll: async (req, res) => {
        try {
            const page = req.query.page || 0;
            const size = req.query.size || 20;
            const total = await ProductModel.countDocuments();
            const listProduct = await ProductModel.find().limit(size).skip(page * size);
            res.json({ code: 200, data: listProduct, total: total });
        } catch (err) {
            res.json({ code: 500, error: err });
        }
    },
    getByProductType: async (req, res) => {
        try {
            const page = req.query.page || 0;
            const size = req.query.size || 20;
            const idCate = req.query.productTypeID;
            const total = await ProductModel.countDocuments({ productTypeID: idCate });
            const listProduct = await ProductModel.find({ productTypeID: idCate }).limit(size).skip(page * size);
            res.json({ code: 200, data: listProduct, total: total });
        } catch (err) {
            res.json({ code: 500, error: err });
        }
    },
    getProductDetail: async (req, res) => {
        try {
            const idPost = req.query.id;
            const productDT = await ProductModel.findById(idPost);
            res.json({ code: 200, data: productDT });
        } catch (err) {
            res.json({ code: 500, error: err });
        }
    },
    create: async (req, res) => {
        authMiddl.verifyToken(req, res, async () => {
            try {
                const productTypeID = req.body.productTypeID;
                const userID = req.user.id;
                const title = req.body.title;
                const description = req.body.description;
                const price = req.body.price;
                const priceSale = req.body.priceSale;
                const thumbnail = req.body.thumbnail;
                const listImage = req.body.listImage;
                const quantity = req.body.quantity;
                const content = req.body.content;
                const newProduct = await new ProductModel({
                    productTypeID: productTypeID,
                    userID: userID,
                    title: title,
                    description: description,
                    thumbnail: thumbnail,
                    price: price,
                    content: content,
                    priceSale: priceSale || price,
                    listImage: listImage,
                    quantity: quantity
                }).save();
                res.json({ code: 200, data: newProduct });
            } catch (err) {
                res.json({ code: 500, error: err });
            }
        })

    },
    update: async (req, res) => {
        authMiddl.verifyToken(req, res, async () => {
            try {
                const productTypeID = req.body.productTypeID;
                const userID = req.user.id;
                const title = req.body.title;
                const description = req.body.description;
                const price = req.body.price;
                const priceSale = req.body.priceSale;
                const thumbnail = req.body.thumbnail;
                const listImage = req.body.listImage;
                const quantity = req.body.quantity;
                const content = req.body.content;
                const id = req.body.id;
                const productUD = await ProductModel.findById(id);
                if (productUD && productUD._id) {
                    const productModify = await ProductModel.findByIdAndUpdate(id, {
                        productTypeID: productTypeID || productUD.productTypeID,
                        userID: userID,
                        title: title || productUD.title,
                        description: description || productUD.description,
                        content: content || productUD.content,
                        thumbnail: thumbnail || productUD.thumbnail,
                        price: price || productUD.price,
                        priceSale: priceSale || productUD.priceSale,
                        listImage: listImage || productUD.listImage,
                        quantity: quantity || productUD.quantity
                    });
                    res.json({ code: 200, data: productModify });
                } else {
                    res.json({ code: 404, error: "không tìm thấy sản phẩm" });
                }
            } catch (err) {
                res.json({ code: 500, error: err });
            }
        })

    },
    delete: async (req, res) => {
        authMiddl.verifyToken(req, res, async () => {
            try {
                const id = req.body.id;
                const postUD = await ProductModel.findByIdAndDelete(id);
                res.json({ code: 200, data: postUD });
            } catch (err) {
                res.json({ code: 500, error: err });
            }
        })

    }
}
module.exports = postController;