const jwt = require("jsonwebtoken");
const User = require("../model/userSchema");

const requireAuth = (req, res, next) => {
  const { jwt: token } = req.cookies;

  //Check if the user has token
  if (token) {
    try {
      const user = jwt.verify(token, process.env.JWT_SECRET);

      //Check if token is valid or not
      if (user) {
        req.user = user;
        next();
      } else {
        res.status(401).json({ message: "Unauthorized" });
      }
    } catch (error) {
      return res.status(401).json({ message: "Unauthorized" });
    }
  } else {
    return res.status(403).json({ message: "Forbidden: No token provided" });
  }
};

const isAdmin = async (req, res, next) => {
  try {
    //req.user should already set by requireAuth
    const user = await User.findById(req.user.id);

    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Access denied: Admins only" });
    }

    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = { requireAuth, isAdmin };
