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
  const handleClearGrid = () => {
    setIsDragging(false);
    setVisitedCells(new Map());
  }
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
    <>
      <h2 className={styles["heading"]}>Drag to Highlight the Grid</h2>
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
              visitedOrder={visitedCells.get(`${row}-${column}`)}
            />
          )),
        )}
      </div>
      <div className={styles["clear-grid-cta-container"]}>
        <button
          className={`${styles["clear-grid-cta"]} ${visitedCells.size <= 0 ? styles["clear-grid-cta--disabled"] : ""}`}
          disabled={visitedCells.size === 0}
          onClick={handleClearGrid}
        >
          Clear grid
        </button>
      </div>
    </>
  );
};
export default DragToHighlightGrid;
