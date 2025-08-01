const User = require("../../model/userSchema");
const Product = require("../../model/productSchema");

const dashboard = async (req, res) => {
  try {
    // Total users
    const totalUsers = await User.countDocuments();

    // Total products
    const totalProducts = await Product.countDocuments();

    // Aggregate all purchases from all users
    const users = await User.find({}, "purchases username email");

    let totalOrders = 0;
    let totalRevenue = 0;
    let recentOrders = [];
    let productPurchaseCount = {};

    users.forEach((user) => {
      user.purchases.forEach((purchase) => {
        totalOrders++;
        totalRevenue += purchase.price * purchase.quantity;
        recentOrders.push({
          username: user.username,
          email: user.email,
          amount: purchase.price * purchase.quantity,
          purchasedAt: purchase.purchasedAt,
          title: purchase.title,
        });

        //count product purchased
        if (purchase.title) {
          productPurchaseCount[purchase.title] =
            (productPurchaseCount[purchase.title] || 0) + purchase.quantity;
        }
      });
    });

    //sort recent orders by date, get latest 5
    recentOrders.sort((a, b) => b.purchasedAt - a.purchasedAt);
    recentOrders = recentOrders.slice(0, 5);

    //top purchased products
    const topProducts = Object.entries(productPurchaseCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([title, count]) => ({ title, count })); //["jacket", 12] => {title: "jacket",count: 12}

    res.json({
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue,
      recentOrders,
      topProducts,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { dashboard };
