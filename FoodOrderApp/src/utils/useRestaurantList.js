import { RESTAURANT_LIST_API } from "./constants";
import { useState, useEffect } from "react";
const useRestaurantList = () => {
  const [listOfRestuarants, setListOfRestuarants] = useState([]);
  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
  try {
      const data = await fetch(RESTAURANT_LIST_API);
    const json = await data.json();
    // optional chaining
    setListOfRestuarants(
      json?.data?.cards[1]?.card?.card?.gridElements?.infoWithStyle?.restaurants?.map( (restaurant , index) =>{
        return {
          ...restaurant,
          promoted: index % 3 === 0 ? true : false
        }
      })
    );
  } catch (error) {
    console.error("error", error)
  }
  };
   
  return listOfRestuarants;
};
export default useRestaurantList;
