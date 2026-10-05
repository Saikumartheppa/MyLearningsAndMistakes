import { MENU_API } from "../utils/constants";
import resInfoData from "../mocks/resInfoData.json"
import { useEffect, useState } from "react";
const useRestaurantMenu = (resId)=> {
    const [resInfo, setResInfo] = useState(null);
    useEffect(() => {
    fetchData(resId);
  }, []);
  
  const fetchData = async (resId) => {
    try {
      
      const data = await fetch(`https://www.swiggy.com/dapi/menu/pl?page-type=REGULAR_MENU&complete-menu=true&lat=13.0569467&lng=80.242469&restaurantId=${resId}&catalog_qa=undefined&query=KFC&submitAction=ENTER`);
      const json = await data?.json();
      setResInfo(json?.data);
      return resInfoData;
    } catch (error) {
      // console.error("error", error)
      return resInfoData?.data
    }
  };
} 
export default useRestaurantMenu;