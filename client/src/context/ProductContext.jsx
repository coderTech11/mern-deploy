import { createContext, useState } from "react";
import { useFetch } from "../utils/hooks";

export const ProductContext = createContext({});

export default function ProductProvider({ children }) {
  const {
    data: productData,
    isLoading,
    error,
  } = useFetch(`${import.meta.env.VITE_BACKEND_URL}/api/products`);

  const [selectedCategory, setSelectedCategory] = useState("All");

  console.log("Product Data is", productData);

  return (
    <ProductContext.Provider
      value={{
        productData,
        isLoading,
        error,
        selectedCategory,
        setSelectedCategory,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}
