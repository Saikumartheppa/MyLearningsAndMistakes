import { useEffect, useState } from "react";
import styles from "./style.module.scss";
const TodoSearch = ({ searchText, setSearchText }) => {
  return (
    <div className={styles["todo__search-container"]}>
      <input
        className={styles["todo__input-field"]}
        value={searchText}
        placeholder="Search Todo..."
        onChange={(e) => setSearchText(e.target.value)}
      ></input>
    </div>
  );
};
export default TodoSearch;
