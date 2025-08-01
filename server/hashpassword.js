require("dotenv").config();
const bcrypt = require("bcryptjs");

const hashedPassword = async () => {
  const password = process.env.ADMIN_PASSWORD;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("hashed password is", hashedPassword);
  } catch (error) {
    console.error("Error hashing password", error);
  }
};

hashedPassword();
