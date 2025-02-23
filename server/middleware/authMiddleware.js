const jwt = require("jsonwebtoken");

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

module.exports = { requireAuth };
