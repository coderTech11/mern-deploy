const Product = require("../../model/productSchema");

//create product
const createProduct = async (req, res) => {
  try {
    const { title, price, description, category, image } = req.body;

    //basic validation
    if (!title || !price || !category) {
      return res
        .status(400)
        .json({ error: "Title, price and category are required" });
    }
    if (Number(price) <= 0) {
      return res.status(400).json({ error: "Price must be a positive number" });
    }

    const newProduct = new Product({
      title,
      price,
      description,
      category,
      image,
    });

    await newProduct.save();
    res
      .status(201)
      .json({ message: "Product created successfully!", product: newProduct });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//edit product
const editProduct = async (req, res) => {
  try {
    const { title, price, description, category, image } = req.body;

    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      {
        title,
        price,
        description,
        category,
        image,
      },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//delete product
const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createProduct,
  editProduct,
  deleteProduct,
};
