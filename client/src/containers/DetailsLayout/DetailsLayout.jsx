import { useFetch } from "../../utils/hooks";
import { useParams, useNavigate } from "react-router-dom";
import "./DetailsLayout.css";
import Star from "../../components/Star/Star";
import { useContext } from "react";
import { CartContext } from "../../context/CartContext";
import { AuthContext } from "../../context/AuthContext";

export default function DetailsLayout() {
  const { productID } = useParams();
  const { data, isLoading, error } = useFetch(
    `${import.meta.env.VITE_BACKEND_URL}/api/products/${productID}`
  );

  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();

  const { isAuthenticated } = useContext(AuthContext);

  const handleAddToCart = () => {
    console.log("product Id is", data._id);
    if (!isAuthenticated) {
      navigate("/signin");
    } else {
      addToCart(data._id);
      navigate("/cart");
    }
  };

  return (
    !isLoading &&
    !error && (
      <section className="product">
        <div className="photo-container">
          <div className="photo-main">
            <img src={data?.image} />
          </div>
          <button className="buy-btn" onClick={handleAddToCart}>
            ADD TO CART
          </button>
        </div>

        <div className="products-info">
          <div className="title">
            <h1>{data?.title}</h1>
            <h2 className="category">{data?.category}</h2>
          </div>
          <div className="rating-section">
            <Star stars={data?.rating?.rate} />
            <p className="count">Rated by {data?.rating?.count} customers</p>
          </div>
          <div className="price">
            Price:<span>${data?.price}</span>
          </div>
          <div className="description">
            <h3>About the products:</h3>
            <p>{data?.description}</p>
          </div>
        </div>
      </section>
    )
  );
}
