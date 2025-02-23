const User = require("../model/userSchema");
const Product = require("../model/productSchema");

//Add to cart
const addToCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const product = await Product.findById(productId); //fetch product details
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const cartItem = user.cart.find(
      (item) => item.productId.toString() === productId
    );

    if (cartItem) {
      cartItem.quantity += 1; //Increment quantity if the products exist
    } else {
      user.cart.push({
        productId,
        quantity: 1,
        price: product.price,
        image: product.image,
        title: product.title,
      });
    }

    await user.save();

    res.status(200).json(user.cart);
  } catch (error) {
    res.status(500).json({ message: "Error adding to cart", error });
  }
};

//Remove from cart
const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.cart = user.cart
      .map((item) => {
        if (item.productId.toString() === productId) {
          item.quantity -= 1;
        }
        return item;
      })
      .filter((item) => item.quantity > 0); //keep items with quantity > 0

    await user.save();

    res.status(200).json(user.cart);
  } catch (error) {
    res.status(500).json({ message: "Error removing from cart", error });
  }
};

//Get cart item
const getCartItems = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user.cart);
  } catch (error) {
    res.status(500).json({ message: "Error fetching cart", error });
  }
};

module.exports = { addToCart, removeFromCart, getCartItems };
