import { useEffect, useState } from "react";
import { ItemCard, PaginationNumbers } from "../pagination/";
import { PAGINATION_API, PAGE_SIZE } from "../constants";
import styles from "./Pagination.module.scss";
const Pagination = () => {
  const [products, setProducts] = useState([]);
  const isProductsDataAvailable = (products?.length ?? 0) > 0;
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = PAGE_SIZE;
  const noOfPages = Math.ceil(products?.length / pageSize);
  const start = currentPage * pageSize;
  const end = start + pageSize;
  const fetchData = async () => {
    const response = await fetch(PAGINATION_API);
    const data = await response.json();
    setProducts(data?.products);
  };
  const handleCurrentPage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const handleNextorPrevPage = (ctaType) => {
    if(ctaType === "PREV"){
       setCurrentPage(prev => prev - 1);
    }else{
       setCurrentPage(prev => prev + 1);
    }
  }
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <div className={styles["pagination"]}>
      <h2 className={styles["pagination__heading"]}>Pagination</h2>
      <div className={styles["pagination__products-container"]}>
        {isProductsDataAvailable ? (
          products.slice(start, end).map((product) => {
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
      <PaginationNumbers
        noOfPages={noOfPages}
        handleCurrentPage={handleCurrentPage}
        currentPage={currentPage}
        handleNextorPrevPage={handleNextorPrevPage}
      />
    </div>
  );
};
export default Pagination;
