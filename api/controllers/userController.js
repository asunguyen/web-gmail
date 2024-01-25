const User = require("../models/user");
const authMiddl = require("../middlewares/authmidd");
const userController = {
    getAllUser: async(req, res) => {
        authMiddl.verifyTokenAdmin(req, res, async () => {
            try{
                let page = parseInt(req.query.page || 1);
                let skips = (page - 1) * 20;
                const user = await User.find().skip(skips).limit(20).sort({ createdAt: -1 });
                const count = await User.countDocuments();
                res.json({code: 200, data: user, totalPage: Math.ceil(count / 20), total: count});
            }catch(err) {
                res.json({code: 500, error: err});
            }
        })
        
    },
    deleteUser: async(req, res) => {
        try{
            const user = await User.findById(req.params.id);
            res.json({code: 200, data: user});
        }catch(err) {
            res.json({code: 500, error: err});
        }
    },
    getInfo: async(req, res) => {
        authMiddl.verifyToken(req, res, async () => {
            try{
                const user = await User.findById(req.user.id);
                res.json({code: 200, data: user});
            } catch(err) {
                res.json({code: 502, error: err});
            }
            
        })
    },
    getInfoByAdmin: async(req, res) => {
        authMiddl.verifyTokenAdmin(req, res, async () => {
            try {
                
            } catch(err) {
                res.json({code: 502, error: err})
            }
        })
    }
}

module.exports = userController;