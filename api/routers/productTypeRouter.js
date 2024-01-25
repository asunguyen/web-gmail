const router = require("express").Router();
const productTypeController = require("../controllers/productTypeController");

router.get("/", productTypeController.getListCategory);
router.get("/detail", productTypeController.getByID);
router.post("/create", productTypeController.createCategory);
router.post("/update", productTypeController.updateCategory);
router.post("/delete", productTypeController.deleteCategory);

module.exports = router;