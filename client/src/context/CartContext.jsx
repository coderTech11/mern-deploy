import { createContext, useContext, useState, useEffect } from "react";
import { ProductContext } from "./ProductContext";
import axios from "axios";
import { AuthContext } from "./AuthContext";

export const CartContext = createContext();

export default function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const { productData, isLoading, error } = useContext(ProductContext);
  const { isAuthenticated } = useContext(AuthContext);

  //fetch cart items
  useEffect(() => {
    const fetchCartItems = async () => {
      if (!isAuthenticated) return; //skip fetching if not authenticated
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/cart`,
          {
            withCredentials: true,
          }
        );
        setCartItems(response.data); //update cart items
      } catch (error) {
        console.error("Error fetching cart items", error);
      }
    };
    fetchCartItems();
  }, [isAuthenticated]);

  //add to cart
  const addToCart = async (productId) => {
    if (isLoading || error || !productData) return;
    console.log("product", productId);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/cart/add`,
        { productId },
        {
          withCredentials: true,
        }
      );
      console.log("cart response", response);
      setCartItems(response.data);
    } catch (error) {
      console.error("Error adding to cart", error);
    }
  };

  //remove from cart
  const removeFromCart = async (productId) => {
    if (isLoading || error || !productData) return;

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/cart/remove`,
        { productId },
        {
          withCredentials: true,
        }
      );
      console.log("deleted cart response", response);
      setCartItems(response.data);
    } catch (error) {
      console.error("Error removing from cart", error);
    }
  };

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, isLoading, error }}
    >
      {children}
    </CartContext.Provider>
  );
}
