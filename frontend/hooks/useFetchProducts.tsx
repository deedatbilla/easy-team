import { useState, useEffect } from "react";
import { AxiosHost } from "@/axiosGlobal";
import { Product } from "@/interfaces";

export function useFetchProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [displayedData, setDisplayedData] = useState<any[]>([]);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  async function fetchProducts() {
    try {
      setLoading(true);
      const { data } = await AxiosHost.get("/products");
      const all = data.products.map((item: Product) => ({
        ...item,
        discountedPrice: item.price,
        percentageValue: 0,
        commission: 0,
      }));
      const initialData = all.slice(0, 10);
      setDisplayedData(initialData);
      setProducts(all);
      setAllProducts(all);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }
  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    loading,
    displayedData,
    allProducts,
    setDisplayedData,
    setProducts,
  };
}
