import { useState } from "react";
import { SquareBox } from "../dragToHighlightGrid";
import { ROWS as rows, COLUMNS as columns } from "../constants";
import styles from "./style.module.scss";
const DragToHighlightGrid = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [visitedCells , setVisitedCells] = useState(new Set());
  const handleDragging = (row , column) => {
    setIsDragging(true);
    const coordinates = `${row}-${column}`;
    setVisitedCells(new Set([coordinates]));
  }
  const handlePointerMove = (row , column) => {
      setVisitedCells((prev) => {
       const coordinates = `${row}-${column}`;
        if(prev.has(coordinates)){
            return prev;
        }
        const set = new Set(prev);
        set.add(coordinates);
        return set;
     })
  }
  const handlePointerUp = () => {
    setIsDragging(false);
  }
  return (
    <div className={styles["drag"]}>
      {Array.from({ length: rows }).map((_, row) =>
        Array.from({ length: columns }).map((_, column) => (
          <SquareBox
            key={`${row}-${column}`}
            row={row}
            column={column}
            isVisited={visitedCells.has(`${row}-${column}`)}
            isDragging={isDragging}
            handleDragging={handleDragging}
            handlePointerMove={handlePointerMove}
            handlePointerUp={handlePointerUp}
          />
        )),
      )}
    </div>
  );
};
export default DragToHighlightGrid;
