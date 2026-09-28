import { useState, useEffect } from "react";
import { SquareBox } from "../dragToHighlightGrid";
import { ROWS as rows, COLUMNS as columns } from "../constants";
import styles from "./style.module.scss";
const DragToHighlightGrid = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [visitedCells, setVisitedCells] = useState(new Map());
  const handleDragging = (row, column) => {
    setIsDragging(true);
    const coordinates = `${row}-${column}`;
    setVisitedCells(() => {
      const map = new Map();
      map.set(coordinates, 1);
      return map;
    });
  };
  const handlePointerMove = (row, column) => {
    setVisitedCells((prev) => {
      const coordinates = `${row}-${column}`;
      if (prev.has(coordinates)) {
        return prev;
      }
      const map = new Map(prev);
      map.set(coordinates, map.size + 1);
      return map;
    });
  };
  const handlePointerUp = () => {
    setIsDragging(false);
  };
  useEffect(() => {
    if (!isDragging) return;
    const stopDragging = () => {
      setIsDragging(false);
    };
    window.addEventListener("pointerup", stopDragging);
    return () => {
      window.removeEventListener("pointerup", stopDragging);
    };
  }, [isDragging]);
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
            visitedOrder={visitedCells.get(`${row}-${column}`)}
          />
        )),
      )}
    </div>
  );
};
export default DragToHighlightGrid;
