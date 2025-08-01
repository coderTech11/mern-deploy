const User = require("../../model/userSchema");

const orders = async (req, res) => {
  try {
    const users = await User.find({}, "username email purchases");

    let allOrders = [];
    users.forEach((user) => {
      user.purchases.forEach((purchase) => {
        allOrders.push({
          username: user.username,
          email: user.email,
          title: purchase.title,
          price: purchase.price,
          quantity: purchase.quantity,
          amount: purchase.price * purchase.quantity,
          purchasedAt: purchase.purchasedAt,
        });
      });
    });

    //sort by most recent
    allOrders.sort((a, b) => b.purchasedAt - a.purchasedAt);

    res.json(allOrders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = orders;
