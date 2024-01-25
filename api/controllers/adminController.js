
const authMiddl = require("../middlewares/authmidd");
const adminController = {
    getListUser: async (req, res) => {
        authMiddl.verifyTokenAdmin(req, res, async () => {

        })
    },
    getUserDetail: async (req, res) => {
        authMiddl.verifyTokenAdmin(req, res, async () => {

        })
    },
    createUser: async (req, res) => {
        authMiddl.verifyTokenAdmin(req, res, async () => {

        })
    },
    getDichVu: async(req, res) => {

    },
    updateDichVu: async (req, res) => {
        authMiddl.verifyTokenAdmin(req, res, async () => {

        })
    },
    createDichVu: async (req, res) => {
        authMiddl.verifyTokenAdmin(req, res, async () => {

        })
    },
    getPayment: async (req, res) => {
        authMiddl.verifyTokenAdmin(req, res, async () => {

        })
    },
}

module.exports = adminController;