const router = require("express").Router();
const sliderController = require("../controllers/sliderController");
router.post("/create", sliderController.create);
router.post("/update", sliderController.update);
router.post("/delete", sliderController.delete);
router.get("/get-all", sliderController.getAll);
module.exports = router;