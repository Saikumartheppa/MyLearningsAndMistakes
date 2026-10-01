import { useEffect, useState } from "react";
import { ItemCard } from "../pagination/";
import { PAGINATION_API } from "../constants";
import styles from "./Pagination.module.scss";
const Pagination = () => {
  const [products, setProducts] = useState([]);
  const isProductsDataAvailable = (products?.length ?? 0) > 0;
  const fetchData = async () => {
    const response = await fetch(PAGINATION_API);
    const data = await response.json();
    setProducts(data?.products);
  };
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <div className={styles["pagination"]}>
      <h2 className={styles["pagination__heading"]}>Pagination</h2>
      <div className={styles["pagination__products-container"]}>
        {isProductsDataAvailable ? (
          products.map((product) => {
            return (
              <ItemCard
                key={product.id}
                productImage={product.thumbnail}
                productTitle={product.title}
              />
            );
          })
        ) : (
          <div>No Products Available....</div>
        )}
      </div>
    </div>
  );
};
export default Pagination;
