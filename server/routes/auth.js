const { Router } = require("express");
const {
  createUser,
  loginUser,
  logOutUser,
  checkAuth,
} = require("../controllers/authController");

const router = Router();

router.post("/signup", createUser);
router.post("/login", loginUser);
router.get("/logout", logOutUser);
router.get("/auth", checkAuth);

module.exports = router;
