const stripe = require("stripe")(process.env.STRIPE_KEY);
const User = require("../model/userSchema");

const checkoutSession = async (req, res) => {
  const { cartItems } = req.body;
  const userId = req.user.id;

  const lineItems = cartItems.map((item) => ({
    price_data: {
      currency: "usd",
      product_data: {
        name: item.title, //Product name from cart
        images: [item.image],
      },
      unit_amount: item.price * 100, //convert price to cents
    },
    quantity: item.quantity,
  }));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: lineItems,
    mode: "payment",
    success_url: `${process.env.BACKEND_ORIGIN}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.ORIGIN}/cancel`,
    //Session retrieval
    metadata: {
      userId: userId,
    },

    //Stripe logs and payment_intent
    payment_intent_data: {
      metadata: {
        userId: userId,
      },
    },
  });

  res.json({ url: session.url });
};

//route to handle success after payment
const successPayment = async (req, res) => {
  const { session_id } = req.query;

  if (!session_id) {
    return res.status(400).json({ message: "sessionId missing" });
  }

  try {
    //retrieve the session details from stripe
    const session = await stripe.checkout.sessions.retrieve(session_id);

    //extract the userId and paymentstatus from session
    const paymentStatus = session.payment_status;

    if (paymentStatus === "paid") {
      const userId = session.metadata.userId;
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      //move paid items from cart to purchases
      const purchasedItems = user.cart.map((item) => ({
        ...item,
        purchasedAt: new Date(),
      }));

      user.purchases = user.purchases.concat(purchasedItems);
      user.cart = []; //clear the cart

      await user.save();

      //redirect to client success page
      return res.redirect(`${process.env.ORIGIN}/success`);
    } else {
      return res.status(400).json({ message: "Payment not completed" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error processing payment" });
  }
};

//purchase
const fetchPurchase = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    //group purchase by date
    const purchaseByDate = {};

    user.purchases.forEach((purchase) => {
      const date = new Date(purchase.purchasedAt).toLocaleString("en-US");

      if (!purchaseByDate[date]) {
        purchaseByDate[date] = [];
      }

      purchaseByDate[date].push(purchase);
    });

    //sort the date in descending order
    const sortedDates = Object.keys(purchaseByDate).sort(
      (a, b) => new Date(b) - new Date(a)
    );

    return res.json({ purchaseByDate, sortedDates });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch purchases" });
  }
};

module.exports = { checkoutSession, successPayment, fetchPurchase };
