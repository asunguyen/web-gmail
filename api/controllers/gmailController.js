const GmailModel = require("../models/gmailModel");
const postController = {
    getEmail: async (req, res) => {
        try {
            
        } catch (err) {
            res.json({ code: 500, error: err });
        }
    },
    updateEmail: async(req, res) => {

    },
    createEmail: async(req, res) => {

    },
    deleteEmail: async(req, res) => {
        
    }
}
module.exports = postController;