import { useContext } from "react";
import { ProductContext } from "../../context/ProductContext";
import ProductCard from "../../components/ProductCard/ProductCard";
import "./HomeLayout.css";

export default function HomeLayout() {
  //context
  const { productData, isLoading, error, selectedCategory } =
    useContext(ProductContext);

  const filteredProducts =
    selectedCategory === "All"
      ? productData
      : productData.filter((product) => product.category === selectedCategory);

  return (
    <section className="products">
      {!isLoading ? (
        !error ? (
          filteredProducts.length > 0 ? (
            filteredProducts.map((product, index) => {
              return <ProductCard data={product} key={index} />;
            })
          ) : (
            <h1> No products found </h1>
          )
        ) : (
          <h1> Some Error Occured </h1>
        )
      ) : (
        <h1> Loading.. </h1>
      )}
    </section>
  );
}
