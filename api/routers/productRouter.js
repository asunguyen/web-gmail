const router = require("express").Router();
const productController = require("../controllers/productController");

router.get("/", productController.getAll);
router.get("/detail", productController.getProductDetail);
router.get("/by-product-type", productController.getByProductType);
router.post("/create", productController.create);
router.post("/update", productController.update);
router.post("/delete", productController.delete);

module.exports = router;