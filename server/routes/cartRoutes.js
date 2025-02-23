const express = require("express");
const {
  addToCart,
  removeFromCart,
  getCartItems,
} = require("../controllers/cartsController");
const router = express.Router();

router.post("/add", addToCart);
router.post("/remove", removeFromCart);
router.get("/", getCartItems);

module.exports = router;
