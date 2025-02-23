const ProductModel = require("../model/productSchema");

//return all products
const returnAllProducts = async (req, res) => {
  try {
    const productData = await ProductModel.find();
    res.json(productData);
  } catch (error) {
    console.log("error is", error);
  }
};

//return single product
const returnSingleProduct = async (req, res) => {
  try {
    const { productID } = req.params;

    const selectedProduct = await ProductModel.findOne({ _id: productID });

    if (selectedProduct) {
      res.json(selectedProduct);
    } else {
      res.status(404).json({ message: "Product doesn't exist" });
    }
  } catch (error) {
    console.log("error is", error.message);
  }
};

module.exports = { returnAllProducts, returnSingleProduct };
