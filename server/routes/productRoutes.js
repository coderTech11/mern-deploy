const express = require("express");
const {
  returnAllProducts,
  returnSingleProduct,
} = require("../controllers/productController");

const router = express.Router();

router.get("/", returnAllProducts);
router.get("/:productID", returnSingleProduct);

module.exports = router;
