const router = require("express").Router();
const uploadController = require("../controllers/uploadController");
const upload = require("../middlewares/uploadMiddleware");
router.get("/", uploadController.getlist);
router.post("/image", upload.single("image"), uploadController.uploadImage);
router.post("/delete", uploadController.delete);

module.exports = router;