const router = require("express").Router();
const gmailController = require("../controllers/gmailController");

router.get("/", gmailController.getEmail);
router.post("/create", gmailController.createEmail);
router.post("/update", gmailController.updateEmail);
router.post("/delete", gmailController.deleteEmail);
router.get("/thue/:quantity", gmailController.rentEmail);
router.get("/mua/:quantity", gmailController.buyEmail);

module.exports = router;