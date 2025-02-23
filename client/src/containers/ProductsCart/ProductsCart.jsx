import { useContext } from "react";
import { CartContext } from "../../context/CartContext";
import "./ProductsCart.css";
import axios from "axios";

export default function ProductsCart() {
  const { cartItems, addToCart, removeFromCart, isLoading, error } =
    useContext(CartContext);
  console.log("cart items is", cartItems);

  //Calculate total price
  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const handlePayment = async (req, res) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/payment/create-checkout-session`,
        { cartItems },
        {
          withCredentials: true,
        }
      );

      //extract the session url from the response
      const { url } = response.data;

      //redirect to stripe checkout page
      window.location.href = url;
    } catch (error) {
      console.error("Error redirecting to checkout", error);
    }
  };

  //explicit conditions for various states
  if (isLoading) return <div>Loading your cart items...</div>;
  if (error) return <div>Failed to load cart items. Please try again</div>;

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-lg font-semibold pb-20">
        <p>Your cart is empty. </p>
        <p>
          If you've made a purchase, check the <strong> Purchase Page </strong>.
        </p>
        <p>
          To add items, go to <strong>Home</strong> and select a product.
        </p>
      </div>
    );
  }

  return (
    <div className="cart_section">
      <h1 className="cart_heading">Your Cart </h1>
      <div className="cart-total">
        <h3>
          Subtotal: <span className="bold_value">${totalPrice.toFixed(2)}</span>
        </h3>
      </div>

      {/* Proceed to payment button */}
      <div className="pay_now_container">
        <button className="pay_now_button" onClick={handlePayment}>
          Proceed to Payment
        </button>
      </div>

      <hr />
      {cartItems.map((item) => (
        <div key={item._id} className="cart_container">
          <div className="left_cart">
            <img src={item.image} alt="" />
          </div>
          <div className="right_cart">
            <h3> {item.title} </h3>
            <div className="details_row">
              <div className="detail_label">QUANTITY</div>
              <div className="detail_label">PRICE</div>
              <div className="detail_label">TOTAL</div>
            </div>
            <div className="details_row values">
              <div>{item.quantity}</div>
              <div>${item.price}</div>
              <div className="bold_value">
                ${(item.price * item.quantity).toFixed(2)}
              </div>
            </div>

            <div className="cart_btn">
              <button
                className="cart_btn1"
                onClick={() => addToCart(item.productId)}
              >
                Add
              </button>

              <button
                className="cart_btn2"
                onClick={() => removeFromCart(item.productId)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
