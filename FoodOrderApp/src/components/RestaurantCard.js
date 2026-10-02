import { IMAGE_URL } from "../utils/constants";
// import "../../style.css";
const RestaurantCard = (props) => {
  const { resData } = props;
  const { cloudinaryImageId, name, avgRating, cuisines, costForTwo, sla} =
    resData?.info;
  return (
    <div className="restuarantCard" data-testid="resCard">
      <img src={`${IMAGE_URL}${cloudinaryImageId}`} alt="food image"/>
      <h3>{name}</h3>
      <h4>{cuisines.join(", ")}</h4>
      <h4>{avgRating} stars</h4>
      <h4>{costForTwo}</h4>
      <h4>{sla?.deliveryTime} Minutes</h4>
    </div>
  );
};

export const withPromotedLabel = (RestaurantCard) => {
  return (props)=>{
    return(
      <div>
      <label className="promoted">Promoted</label>
      <RestaurantCard{...props} />
      </div>
    )
  }
}
export default RestaurantCard;
