const router = require("express").Router();
const gmailController = require("../controllers/gmailController");

router.get("/", gmailController.getEmail);
router.post("/create", gmailController.createEmail);
router.post("/update", gmailController.updateEmail);
router.post("/delete", gmailController.deleteEmail);

module.exports = router;