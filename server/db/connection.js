const mongoose = require("mongoose");
const productJson = require("../data/productData.json");
const ProductModel = require("../model/productSchema");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DBURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    const productCount = await ProductModel.countDocuments();

    if (productCount == 0) {
      await ProductModel.create(productJson);
      console.log("Product Inserted successfully");
    } else {
      console.log("Product already exist, skipping insertion");
    }
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log("Failed to connect to MongoDB", error);
  }
};

module.exports = connectDB;
