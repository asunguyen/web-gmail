const authMiddl = require("../middlewares/authmidd");
const PostModel = require("../models/postModel");

const postController = {
    getAll: async (req, res) => {
        try {
            const page = req.query.page || 0;
            const size = req.query.size || 20;
            const total = await PostModel.countDocuments();
            const listPost = await PostModel.find().limit(size).skip(page * size);
            res.json({ code: 200, data: listPost, total: total });
        } catch (err) {
            res.json({ code: 500, error: err });
        }
    },
    getListPostByUser: async (req, res) => {
        authMiddl.verifyToken(req, res, async () => {
            try {
                const page = req.query.page || 0;
                const size = req.query.size || 20;
                const idUser = req.user.id;
                const total = await PostModel.countDocuments({ userID: idUser });
                const listPost = await PostModel.find({ userID: idUser }).limit(size).skip(page * size);
                res.json({ code: 200, data: listPost, total: total });
            } catch (err) {
                res.json({ code: 500, error: err });
            }
        })
    },
    getPostByCategory: async (req, res) => {
        try {
            const page = req.query.page || 0;
            const size = req.query.size || 20;
            const idCate = req.query.categoryID;
            const total = await PostModel.countDocuments({ categoryID: idCate });
            const listPost = await PostModel.find({ categoryID: idCate }).limit(size).skip(page * size);
            res.json({ code: 200, data: listPost, total: total });
        } catch (err) {
            res.json({ code: 500, error: err });
        }
    },
    getPostDetail: async (req, res) => {
        try {
            const idPost = req.query.id;
            const listPost = await PostModel.findById(idPost);
            res.json({ code: 200, data: listPost });
        } catch (err) {
            res.json({ code: 500, error: err });
        }
    },
    create: async (req, res) => {
        authMiddl.verifyToken(req, res, async () => {
            try {
                const categoryID = req.body.categoryID;
                const userID = req.user.id;
                const title = req.body.title;
                const description = req.body.description;
                const content = req.body.content;
                const thumbnail = req.body.thumbnail;
                const newPost = await new PostModel({
                    categoryID: categoryID,
                    userID: userID,
                    title: title,
                    description: description,
                    content: content,
                    thumbnail: thumbnail
                }).save();
                res.json({code: 200, data: newPost});
            } catch (err) {
                res.json({ code: 500, error: err });
            }
        })

    },
    update: async (req, res) => {
        authMiddl.verifyToken(req, res, async () => {
            try {
                const categoryID = req.body.categoryID;
                const userID = req.user.id;
                const title = req.body.title;
                const description = req.body.description;
                const content = req.body.content;
                const thumbnail = req.body.thumbnail;
                const id = req.body.id;
                const postUD = await PostModel.findById(id);
                if (postUD && postUD._id) {
                    const postModify = await PostModel.findByIdAndUpdate(id, {
                        categoryID: categoryID || postUD.categoryID,
                        userID: userID || postUD.userID,
                        title: title || postUD.title,
                        description: description || postUD.description,
                        content: content || postUD.content,
                        thumbnail: thumbnail || postUD.thumbnail
                    });
                    res.json({code: 200, data: postModify});
                }else {
                    res.json({code: 404, error: "không tìm thấy bài viết"});
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
                const postUD = await PostModel.findByIdAndDelete(id);
                res.json({code: 200, data: postUD});
            } catch (err) {
                res.json({ code: 500, error: err });
            }
        })

    }
}
module.exports = postController;