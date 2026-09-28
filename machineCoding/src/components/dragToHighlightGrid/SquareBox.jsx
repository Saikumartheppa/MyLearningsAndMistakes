import styles from "./style.module.scss";
const SquareBox = ({ row, column,isVisited, isDragging ,  handleDragging, handlePointerMove  , visitedOrder}) => {
  return (
    <div
      className={`${styles["drag__square-box"]} ${isVisited ? styles["drag--square-bg"] : "" }`}
      onPointerDown={() => handleDragging(row, column)}
      onPointerMove={() => isDragging && handlePointerMove(row , column)}
    >
      {visitedOrder}
    </div>
  );
};
export default SquareBox;
