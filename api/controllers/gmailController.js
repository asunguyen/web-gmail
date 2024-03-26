const GmailModel = require("../models/gmailModel");
const authMiddl = require("../middlewares/authmidd");

const xlsx = require("xlsx");
const path = require('path');

const postController = {
  getEmail: async (req, res) => {
    authMiddl.verifyToken(req, res, async() => {
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
    })
  },
  updateEmail: async (req, res) => {
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
          handle: datamail.handle || "",
          checkLive: datamail.handle || 1,
          regDone: datamail.handle || [],
          status: datamail.handle || false,
          timeUpdate: new Date().getTime(),
          otp: datamail.handle || "",
        });
        res.json({ code: 200, data: "Update thành công!" });
      } else {
        res.json({ code: 404, data: "Không tìm thấy email" });
      }
    } catch (err) {
      res.json({ code: 500, error: err });
    }
  },
  createEmail: async (req, res) => {
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
  },
  deleteEmail: async (req, res) => {
    try {
      const mail = req.body.mail;
      const datamail = await GmailModel.find({ mail: mail });
      if (datamail && datamail.length > 0) {
        await GmailModel.findByIdAndDelete(datamail[0]._id);
        res.json({ code: 200, data: "Xóa thành công" });
      } else {
        res.json({ code: 404, data: "không tìm thấy email" });
      }
    } catch (err) {
      res.json({ code: 500, error: "xóa mail lỗi vui lòng thử lại" });
    }
  },
  buyEmail: async (req, res) => {
    try {
      const page = req.query.page || 0;
      const size = req.query.size || 20;
      const listMail = await GmailModel.find({ checkLive: 1 })
        .limit(size)
        .skip(page * size);
      if (listMail.length > 0) {
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
        const path = path.join(__dirname, `../email-file-excel/${excelFileName}.xlsx`);
        xlsx.writeFile(workbook, path);
        res.download(path);
      }
    } catch (err) {
      res.json({ code: 500, error: "Có lỗi xảy ra, vui lòng thử lại" });
    }
  },
  rentEmail: async (req, res) => {
    try {
      const page = req.query.page || 0;
      const size = req.query.size || 20;
      const listMail = await GmailModel.find({ checkLive: 2 })
        .limit(size)
        .skip(page * size);
      res.json({ code: 200, data: listMail });
    } catch (err) {
      res.json({ code: 500, error: "Có lỗi xảy ra, vui lòng thử lại" });
    }
  },
};
module.exports = postController;
