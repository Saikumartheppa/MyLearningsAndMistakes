import { useState } from "react";
import ItemList from "./ItemList";
// import "../../style.css";
const RestaurantCategory = ({data , showItems , setShowIndex}) => {
  const handleClick = () =>{
    setShowIndex();
  }
  return (
    <div>
      <div>
        <div className="restaurant-categories">
            <div className="category" onClick={handleClick}>
          <div className="category-title">
            {data?.title}({data?.itemCards?.length})
          </div>
          <div className={`downArrow ${!showItems ? "rotate" : ""}` }>
          </div>
          </div>
          <div>
           {showItems && <ItemList items={data?.itemCards}/> }
          </div>
        </div>
      </div>
    </div>
  );
};
export default RestaurantCategory;
