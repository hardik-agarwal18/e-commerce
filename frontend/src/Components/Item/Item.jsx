import React, { useContext } from "react";
import "./Item.css";
import { Link } from "react-router-dom";
import { ShopContext } from "../../Context/ShopContext";

const Item = (props) => {
  const { addToWishlist, removeFromWishlist, isInWishlist } =
    useContext(ShopContext);
  const inWishlist = isInWishlist(props.id);

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (inWishlist) {
      removeFromWishlist(props.id);
    } else {
      addToWishlist(props.id);
    }
  };

  return (
    <div className="item">
      <button
        className={`item-wishlist-btn ${inWishlist ? "in-wishlist" : ""}`}
        onClick={handleWishlistToggle}
        title={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill={inWishlist ? "#ff4141" : "none"}
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      </button>
      <Link to={`/product/${props.id}`}>
        {/* scrollTo is used to open the top of the page */}
        <img onClick={window.scrollTo(0, 0)} src={props.image} alt="/" />
      </Link>
      <p>{props.name}</p>
      <div className="items-price">
        <div className="items-price-new">${props.new_price}</div>
        <div className="item-price-old">${props.old_price}</div>
      </div>
    </div>
  );
};

export default Item;
