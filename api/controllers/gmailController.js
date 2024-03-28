const authMiddl = require("../middlewares/authmidd");
const GmailModel = require("../models/gmailModel");
const OrderModel = require("../models/order");
const { mongoose } = require("mongoose");
const User = require("../models/user");
const xlsx = require("xlsx");
const path = require("path");

const postController = {
  getEmail: async (req, res) => {
    authMiddl.verifyToken(req, res, async () => {
      try {
        const page = req.query.page || 0;
        const size = req.query.size || 20;
        const type = req.query.type;
        const condition = type ? { checkLive: type } : {};
        const totalGmail = await GmailModel.countDocuments(condition);
        const listMail = await GmailModel.find(condition)
          .limit(size)
          .skip(page * size);
        res.json({ code: 200, data: listMail, total: totalGmail });
      } catch (err) {
        res.json({ code: 500, error: err });
      }
    });
  },

  updateEmail: async (req, res) => {
    authMiddl.verifyToken(req, res, async () => {
    try {
      const pass = req.body.pass;
      const time = req.body.time;
      const token = req.body.token;
      const mail = req.body.mail;
      const id = req.body.id;
      const datamail = await GmailModel.findById(id);
      if (datamail) {
        await GmailModel.findByIdAndUpdate(id, {
          pass,
          mail,
          time,
          token,
        });
        res.json({ code: 200, data: "Update thành công!" });
      } else {
        res.json({ code: 404, data: "Không tìm thấy email" });
      }
    } catch (err) {
      res.json({ code: 500, error: err });
      }
    });
  },

  createEmail: async (req, res) => {
    authMiddl.verifyToken(req, res, async () => {
    try {
      const mail = req.body.mail;
      const token = req.body.token;
      const time = req.body.time;
      const pass = req.body.pass;
      const maill = await GmailModel.find({ mail: mail });
      if (!maill || maill.length <= 0) {
        const newmail = await new GmailModel({
          mail: mail,
          time: time,
          pass: pass,
          token: token,
        }).save();
        res.json({ code: 200, data: newmail });
      } else {
        res.json({ code: 500, error: "mail đã tồn tại" });
      }
    } catch (err) {
      res.json({ code: 500, error: "Lỗi thêm email" });
      }
    });
  },

  deleteEmail: async (req, res) => {
    authMiddl.verifyToken(req, res, async () => {
    try {
      const mail = req.body.mail;
      const datamail = await GmailModel.find({ mail: mail });
      if (datamail && datamail.length > 0) {
        await GmailModel.findByIdAndDelete(datamail[0]._id);
        res.json({ code: 200, data: "Xóa thành công" });
      } else {
        res.json({ code: 404, data: "Không tìm thấy email" });
      }
    } catch (err) {
      res.json({ code: 500, error: "Xóa mail lỗi vui lòng thử lại" });
      }
    });
  },

  buyEmail: async (req, res) => {
    authMiddl.verifyToken(req, res, async () => {
    try {
      const quantity = req.params.quantity || 0;

      const listMail = await GmailModel.find({ checkLive: 0 }).limit(
        Number(quantity)
      );
      if (listMail.length > 0) {
        const price = 1000 * listMail.length;
        const user = await User.findById(req.body.userId);
        if (user) {
          if (user.amount >= price) {
            const newData = listMail.map((item) => ({
              Email: item.mail,
              Password: item.pass,
              Token: item.token,
            }));
            let workbook = xlsx.utils.book_new();
            let worksheet = xlsx.utils.json_to_sheet(
              JSON.parse(JSON.stringify(newData))
            );
            xlsx.utils.book_append_sheet(workbook, worksheet, "List Email");
            const excelFileName = "ListEmail-" + new Date().getTime();
            const folder = path.join(__dirname, `../email-file-excel`);
            pathExcelFile = `${folder}\\${excelFileName}.xlsx`;
            xlsx.writeFile(workbook, pathExcelFile);

            await User.findByIdAndUpdate(user._id, {
              amount: user.amount - price,
            });
            await new OrderModel({
              userId: new mongoose.mongo.ObjectId(user._id),
              fileName: pathExcelFile,
              price: price,
            }).save();
            listMail.forEach(async (item) => {
              await GmailModel.findByIdAndUpdate(item.id, {
                checkLive: 1,
              });
            });
            res.download(pathExcelFile);
          } else {
            res.json({
              code: 500,
              data: `Không đủ tiền để mua ${quantity} email.`,
            });
          }
        } else {
          res.json({ code: 404, data: "Không tìm thấy user" });
        }
      } else {
        res.json({ code: 404, data: "Đã hết email để mua" });
      }
    } catch (err) {
      res.json({ code: 500, error: "Có lỗi xảy ra, vui lòng thử lại" });
      }
    });
  },
  
  rentEmail: async (req, res) => {
    authMiddl.verifyToken(req, res, async () => {
    try {
      const quantity = req.params.quantity || 0;
      const listMail = await GmailModel.find({ checkLive: 0 }).limit(quantity);
      res.json({ code: 200, data: listMail });
    } catch (err) {
      res.json({ code: 500, error: "Có lỗi xảy ra, vui lòng thử lại" });
      }
    });
  },
};
module.exports = postController;
