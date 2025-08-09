require("dotenv").config();

const express = require("express");
const app = express();
const authRoutes = require("./routes/auth");
const cookieParser = require("cookie-parser");
const { requireAuth, isAdmin } = require("./middleware/authMiddleware");
const connectDB = require("./db/connection");
const productRouter = require("./routes/productRoutes");
const cors = require("cors");
const cartRouter = require("./routes/cartRoutes");
const paymentRouter = require("./routes/paymentRoutes");
const adminRouter = require("./routes/adminRoutes");

//middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.ORIGIN,
    credentials: true,
  })
);

// serve static build output
const staticDir = path.join(__dirname, "client", "dist");
app.use(express.static(staticDir));

const PORT = process.env.PORT || 3000;

//routes
app.use(authRoutes);
app.use("/api/products", productRouter);
app.use("/cart", requireAuth, cartRouter);
app.use("/payment", requireAuth, paymentRouter);
app.use("/admin", requireAuth, isAdmin, adminRouter);

// SPA catch-all
app.get("*", (req, res, next) => {
  if (
    req.path.startsWith("/api") ||
    req.path.startsWith("/cart") ||
    req.path.startsWith("/payment") ||
    req.path.startsWith("/admin")
  ) {
    return next();
  }
  res.sendFile(path.join(staticDir, "index.html"));
});

connectDB().then(() => {
  //Start the server
  app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
  });
});
