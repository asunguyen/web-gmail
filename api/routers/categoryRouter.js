const router = require("express").Router();
const categoryController = require("../controllers/categoryController");

router.get("/", categoryController.getListCategory);
router.get("/detail", categoryController.getByID);
router.post("/create", categoryController.createCategory);
router.post("/update", categoryController.updateCategory);
router.post("/delete", categoryController.deleteCategory);

module.exports = router;