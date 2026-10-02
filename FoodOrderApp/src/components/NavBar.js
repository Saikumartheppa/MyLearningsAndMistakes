import { LOGO_URL } from "../utils/constants";
import { Link } from "react-router-dom";
import { useContext } from "react";
import UserContext from "../utils/UserContext";
import { useSelector } from "react-redux";

const NavBar = () => {
  const {loggedInUser} = useContext(UserContext);
  const cartItems = useSelector((store) => store.cart.items);
  console.log(cartItems);
  return (
    <div className="nav" data-testid="nav">
      <div className="navItems">
        <div className="logo">
          <img src={LOGO_URL} />
        </div>
        <div className="items">
          <ul>
            <Link to={"/"}><li>Home</li> </Link>
           <Link to="/about"><li>About</li></Link>
            <Link to={"/contact"}><li>Contact US</li></Link>
            <Link to={"/cart"}><li className="cart">Cart - ({cartItems.length} items)</li></Link>
            <li>{loggedInUser}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
export default NavBar;