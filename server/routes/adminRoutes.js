const express = require("express");
const { dashboard } = require("../controllers/adminController/dashboard.js");
const {
  users,
  deleteUser,
  editUser,
} = require("../controllers/adminController/user.js");
const { createUser } = require("../controllers/authController.js");
const { returnAllProducts } = require("../controllers/productController.js");
const {
  createProduct,
  editProduct,
  deleteProduct,
} = require("../controllers/adminController/product.js");
const orders = require("../controllers/adminController/order.js");

const router = express.Router();

router.get("/dashboard", dashboard);
router.get("/users", users);
router.delete("/deleteUsers/:id", deleteUser);
router.put("/editUsers/:id", editUser);
router.post("/signup", createUser);
router.get("/products", returnAllProducts);
router.post("/products", createProduct);
router.delete("/deleteProduct/:id", deleteProduct);
router.put("/editProduct/:id", editProduct);
router.get("/orders", orders);

module.exports = router;
