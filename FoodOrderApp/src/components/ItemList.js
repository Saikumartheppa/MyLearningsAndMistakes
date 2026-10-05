import { useDispatch, useSelector } from "react-redux";
import { IMAGE_URL } from "../utils/constants";
import { addItem, removeItem } from "../utils/cartSlice";
// import "../../style.css";
const ItemList = ({ items }) => {
  const dispatch = useDispatch();
  const cartItems = useSelector((store) => store.cart.items);
  const getQuantity = (id) => {
    const item = cartItems.find((item) => item?.card?.info?.id === id);
    return item ? item.quantity : 0;
  };
  const handleAddItem = (item) => {
    dispatch(addItem(item));
  };
  const handleRemoveItem = (id) => {
   dispatch(removeItem(id));
  };
  return (
    <div>
      console.log(items);
      {items?.map((item) => {
        const id = item?.card?.info?.id;
        const quantity = getQuantity(id);
        return (
          <div key={item?.card?.info?.id} className="item-container">
            <div className="item">
              <div className="item-name">{item?.card?.info?.name}</div>
              <div className="item-price">
                ₹
                {item?.card?.info?.price
                  ? item?.card?.info?.price / 100
                  : item?.card?.info?.defaultPrice / 100}
              </div>
              <div className="item-description">
                <p> {item?.card?.info?.description}</p>
              </div>
            </div>
            <div>
              {quantity === 0 ? (
                <div className="add-btn">
                  <button onClick={() => handleAddItem(item)}>ADD</button>
                </div>
              ) : (
                <div className="quantity-btns">
                  <div className="add-remove">
                    <button onClick={() => handleRemoveItem(id)}>-</button>
                    <span>{quantity}</span>
                    <button onClick={() => handleAddItem(item)}>+</button>
                  </div>
                </div>
              )}
              <div className="item-image">
                <img src={IMAGE_URL + item?.card?.info?.imageId} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
export default ItemList;
