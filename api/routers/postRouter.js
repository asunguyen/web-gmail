const router = require("express").Router();
const postController = require("../controllers/postController");

router.get("/", postController.getAll);
router.get("/detail", postController.getPostDetail);
router.get("/by-user", postController.getListPostByUser);
router.get("/by-category", postController.getPostByCategory);
router.post("/create", postController.create);
router.post("/update", postController.update);
router.post("/delete", postController.delete);

module.exports = router;