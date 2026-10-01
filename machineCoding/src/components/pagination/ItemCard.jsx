import styles from "./Pagination.module.scss";
const ItemCard = ({productImage , productTitle}) => {
  return <div className={styles['pagination__product-card']}>
    <img className={styles['pagination__product-img']} src={productImage} alt="productTitle" />
    <p>{productTitle}</p>
  </div>;
};
export default ItemCard;
