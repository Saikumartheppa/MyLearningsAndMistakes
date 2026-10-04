import styles from "./Pagination.module.scss";
const PaginationNumbers = ({
  noOfPages,
  handleCurrentPage,
  currentPage,
  handleNextorPrevPage,
}) => {
  return (
    <div className={styles["pagination__page-numbers-container"]}>
      <button
        className={`${styles["pagination__page-cta"]} ${currentPage === 0 ? styles["pagination__page-cta--disabled"] : ""}`}
        onClick={() => handleNextorPrevPage("PREV")}
        disabled={currentPage === 0}
      >
        {"<"}
      </button>
      {[...new Array(noOfPages).keys()].map((page) => {
        return (
          <button
            className={`${styles["pagination__page-cta"]} ${currentPage === page ? styles["pagination__page-cta--active"] : ""}`}
            key={page}
            onClick={() => handleCurrentPage(page)}
          >
            {page}
          </button>
        );
      })}
      <button
        className={`${styles["pagination__page-cta"]} ${currentPage === noOfPages - 1 ? styles["pagination__page-cta--disabled"] : ""}`}
        onClick={() => handleNextorPrevPage("NEXT")}
        disabled={currentPage === noOfPages - 1}
      >
        {">"}
      </button>
    </div>
  );
};
export default PaginationNumbers;
