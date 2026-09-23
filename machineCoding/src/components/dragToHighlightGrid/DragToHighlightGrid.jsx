import { SquareBox } from "../dragToHighlightGrid";
import { ROWS as rows, COLUMNS as columns } from "../constants";
import styles from "./style.module.scss";
const DragToHighlightGrid = () => {
  return <div className={styles["drag"]}>
    {Array.from({ length: rows }).map((_, row) =>
      Array.from({ length: columns }).map((_, column) => (
        <SquareBox key={`${row}-${column}`} row={row} column={column}/>
      )),
    )}
  </div>;
};
export default DragToHighlightGrid;
