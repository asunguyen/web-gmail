const authMiddl = require("../middlewares/authmidd");
const ProductTypeModel = require("../models/productTypeModel");

const productTypeController = {
    createCategory: async(req, res) => {
        authMiddl.verifyToken(req, res, async() => {
            try {
                const title = req.body.title;
                const description = req.body.description;
                const parentID = req.body.parentID;
                const slug = req.body.slug;
                const newCate = await new ProductTypeModel({
                    title: title,
                    description: description,
                    parentID: parentID,
                    slug: slug
                }).save();
                res.json({code: 200, data: newCate});
            }catch(err) {
                res.json({code: 500, error: err});
            }
            

        })
    },
    updateCategory: async(req, res) => {
        authMiddl.verifyToken(req, res, async() => {
            try {
                const title = req.body.title;
                const description = req.body.description;
                const parentID = req.body.parentID;
                const slug = req.body.slug;
                const id = req.body.id;
                const cateUD = await ProductTypeModel.findById(id);
                if (cateUD && cateUD._id) {
                    const cateModify = await ProductTypeModel.findByIdAndUpdate(id, {
                        title: title || cateUD.title,
                        description: description || cateUD.description,
                        parentID: parentID || cateUD.parentID,
                        slug: slug || cateUD.slug
                    });
                    res.json({code: 200, data: cateModify});
                } else {
                    res.json({code: 404, error: "không tìm thấy category"});
                }
                
            }catch(err) {
                res.json({code: 500, error: err});
            }
        })
    },
    deleteCategory: async(req, res) => {
        authMiddl.verifyToken(req, res, async() => {
            try {
                const id = req.body.id;
                const cateDel = await ProductTypeModel.findByIdAndDelete(id);
                res.json({code: 200, data: cateDel});
            }catch(err) {
                res.json({code: 500, error: err});
            }
        })
    },
    getListCategory: async(req, res) => {
        try {
            const page = req.query.page;
            const size = req.query.size;
            const count = await ProductTypeModel.countDocuments();
            const listCate = await ProductTypeModel.find().limit(size).skip(page*size);
            res.json({code: 200, data: listCate, totalPage: count});
        }catch(err) {
            res.json({code: 500, error: err});
        }
    },
    getByID: async(req, res) => {
        try {
            const id = req.query.id;
            const cate = await ProductTypeModel.findById(id);
            if (cate && cate._id) {
                res.json({code: 200, data: cate});
            } else {
                res.json({code: 404, error: "Không tìm thấy category"});
            }
        }catch(err) {
            res.json({code: 500, error: err});
        }
    }
};
module.exports = productTypeController;