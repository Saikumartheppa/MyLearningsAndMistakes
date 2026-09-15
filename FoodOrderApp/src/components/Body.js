import RestaurantCard, { withPromotedLabel } from "./RestaurantCard";
import { useState, useEffect  } from "react";
import Shimmer from "./Shimmer";
import { Link } from "react-router-dom";
import useRestaurantList from "../utils/useRestaurantList";
import useOnlineStatus from "../utils/useOnlineStatus";
// import UserContext from "../utils/UserContext";
// import '../../style.css';
const Body = () => {
  // useState returns an Array . this is same we've used destructuring.
  // const arr = useState(restaurantList);
  // const listOfRestuarants = arr[0];
  // const setListOfRestuarants = arr[1];

  const listOfRestuarants = useRestaurantList();
  const [filteredListOfRestuarantsByName, setFilteredListOfRestuarants] =
    useState([]);
  const [searchInput, setSearchInput] = useState("");
  const RestaurantCardPromoted = withPromotedLabel(RestaurantCard);
  
  useEffect(() => {
    setFilteredListOfRestuarants(listOfRestuarants);
  }, [listOfRestuarants]);
  const onlineStatus = useOnlineStatus();
  if (!onlineStatus) {
    return (
      <h1>Looks like you're offline!! Please check your internet connection</h1>
    );
  }
  // const { loggedInUser , setUserName } = useContext(UserContext);

  // Conditional Rendering
  if (!listOfRestuarants?.length) {
    return <Shimmer />;
  }
  return (
    <div className="bodyContainer">
      <div className="search-filter">
        <div className="search-input">
          <input
            type="text"
            value={searchInput}
            data-testid="searchInput"
            onChange={(e) => {
              setSearchInput(e.target.value);
            }}
          ></input>
          <button
            className="search-btn"
            onClick={() => {
              const filteredListOfResByName = listOfRestuarants.filter(
                (restuarant) =>
                  restuarant?.info?.name
                    ?.toLowerCase()
                    .includes(searchInput.toLowerCase())
              );
              setFilteredListOfRestuarants(filteredListOfResByName);
            }}
            disabled={searchInput.trim().length < 3}
          >
            Search
          </button>
        </div>
        <button
          className="filter-btn"
          onClick={() => {
            // Top Rated Restuarants Filter Logic
            const filteredListOfRestuarants = listOfRestuarants
              .filter((restuarant) => restuarant.info.avgRating > 4)
              .sort((a, b) => b.info.avgRating - a.info.avgRating);
            setFilteredListOfRestuarants(filteredListOfRestuarants);
          }}
        >
          Top Rated Restaurants
        </button>
        <div className="userName">
          <label>UserName</label>
          <input value={""}
          onChange={(e) => {}}></input>
        </div>
      </div>
      <div className="restaurantContainer">
        {filteredListOfRestuarantsByName.map((restuarant) => (
          //  not using Key <<<<<< Using Index as Key <<<<<< Using uniqueId as a key
          <Link
            key={restuarant?.info?.id}
            to={"/restaurants/" + restuarant?.info?.id}
          >
            {restuarant?.promoted ? (
              <RestaurantCardPromoted resData={restuarant} />
            ) : (
              <RestaurantCard resData={restuarant} />
            )}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Body;
