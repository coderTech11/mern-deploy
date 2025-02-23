const express = require("express");

const {
  checkoutSession,
  successPayment,
  fetchPurchase,
} = require("../controllers/paymentController");

const router = express.Router();

router.post("/create-checkout-session", checkoutSession);
router.get("/success", successPayment);
router.get("/purchases", fetchPurchase);

module.exports = router;
