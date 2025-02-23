import { useEffect, useState } from "react";
import axios from "axios";
import "./PurchaseProduct.css";

export default function PurchaseProduct() {
  const [purchaseProduct, setPurchaseProduct] = useState({});
  const [sortedDates, setSortedDates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPurchasedItems = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/payment/purchases`,
          { withCredentials: true }
        );
        console.log("response is", response);
        setPurchaseProduct(response.data.purchaseByDate);
        setSortedDates(response.data.sortedDates);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching purchased items", error);
        setError("Failed to load purchased items.Please try again");
        setLoading(false);
      }
    };

    fetchPurchasedItems();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen text-lg font-semibold pb-20">
        Loading your purchases...
      </div>
    );
  if (error)
    return (
      <div className="flex items-center justify-center h-screen text-red-500 text-lg font-semibold pb-20">
        {error}
      </div>
    );

  if (Object.keys(purchaseProduct).length === 0) {
    return (
      <div className="flex items-center justify-center h-screen text-lg font-semibold pb-20">
        No purchases yet.
        <br />
        Start Shopping !
      </div>
    );
  }

  return (
    <div className="purchase-container">
      <h1 className="purchase_heading">Your Purchase </h1>
      {sortedDates.map((date) => (
        <div key={date}>
          <h2 className="purchase-date">{date}</h2>
          <div className="purchase-list">
            {purchaseProduct[date].map((product) => (
              <div key={product.productId} className="purchase-card">
                <img
                  src={product.image}
                  alt={product.title}
                  className="purchase-image"
                />
                <div className="purchase-content">
                  <h3 className="purchase-title" title={product.title}>
                    {product.title}
                  </h3>
                  <p className="purchase-price">${product.price.toFixed(2)}</p>
                  <p className="purchase-quantity">
                    Quantity: {product.quantity}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
