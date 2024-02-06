const GmailModel = require("../models/gmailModel");
const ThueMailModel = require("../models/thuemailModel");
const authMiddl = require("../middlewares/authmidd");
const postController = {
    getEmail: async (req, res) => {
        authMiddl.verifyToken(req, res, async() => {
            try {
                const num = req.query.num || 1;
                const brand = req.query.brand;
                

            } catch (err) {
                res.json({ code: 500, error: err });
            }
        })
        
    },
    updateEmail: async(req, res) => {

    },
    createEmail: async(req, res) => {
        try{
            const mail = req.body.mail;
            const token = req.body.token;
            const time = req.body.time;
            const pass = req.body.pass;
            const maill = await GmailModel.find({mail: mail});
            if (!maill || maill.length <= 0) {
                const newmail = await new GmailModel({
                    mail: mail,
                    time: time,
                    pass: pass,
                    token: token
                }).save();
                res.json({code: 200, data: newmail});
            } else {
                res.json({code: 500, error: "mail đã tồn tại"});
            }
        }catch(err) {
            res.json({code: 500, error: "Lỗi thêm email"});
        }
    },
    deleteEmail: async(req, res) => {
        
    }
}
module.exports = postController;