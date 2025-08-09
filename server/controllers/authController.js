const User = require("../model/userSchema");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

//create user
const createUser = async (req, res) => {
  try {
    //check if email already exists
    const exisitingUser = await User.findOne({ email: req.body.email });
    if (exisitingUser) {
      return res
        .status(400)
        .json({ errors: { email: "Email already exists" } });
    }

    // create a user in db
    const user = await User.create(req.body);

    res.status(201).json({
      user: {
        id: user._id,
        email: user.email,
        password: user.password,
        role: user.role,
      },
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const errors = {};
      Object.keys(error.errors).forEach((key) => {
        errors[key] = error.errors[key].message;
      });
      res.status(400).json({ errors });
    }
  }
};

//login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (user) {
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (passwordMatch) {
        const token = jwt.sign(
          { id: user._id, email: user.email },
          process.env.JWT_SECRET,
          {
            expiresIn: "15d",
          }
        );

        res.cookie("jwt", token, {
          httpOnly: true,
          sameSite: "None",
          secure: true,
        });

        res.status(201).json({
          user: {
            id: user._id,
            email: user.email,
            password: user.password,
            role: user.role,
          },
          token,
        });
      } else {
        return res
          .status(400)
          .json({ errors: { password: "Incorrect password" } });
      }
    } else {
      return res
        .status(400)
        .json({ errors: { email: "No user found with this email" } });
    }
  } catch (error) {
    res.status(500).json({ message: "Login is failed" });
  }
};

//logout user
const logOutUser = (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    sameSite: "None",
    secure: true,
    path: "/",
    maxAge: 1,
  });
  res.status(200).json({ message: "Logged out successfully" });
};

//check auth
const checkAuth = async (req, res) => {
  const token = req.cookies.jwt;

  if (!token) {
    return res.status(401).json({ authenticated: false });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    //find the user in database
    const user = await User.findById(decoded.id);

    if (!user) {
      return res
        .status(404)
        .json({ authenticated: false, message: "User not found" });
    }

    res.status(200).json({ authenticated: true, role: user.role });
  } catch {
    res.status(401).json({ authenticated: false });
  }
};

module.exports = {
  createUser,
  loginUser,
  logOutUser,
  checkAuth,
};
