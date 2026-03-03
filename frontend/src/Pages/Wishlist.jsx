import React, { useContext } from "react";
import "./CSS/Wishlist.css";
import { ShopContext } from "../Context/ShopContext";
import { Link } from "react-router-dom";

const Wishlist = () => {
  const { all_product, wishlistItems, removeFromWishlist, loading } =
    useContext(ShopContext);

  // Get wishlist products
  const wishlistProducts = all_product.filter((product) =>
    wishlistItems.includes(product.id),
  );

  if (loading) {
    return (
      <div className="wishlist">
        <div className="wishlist-header">
          <h1>My Wishlist</h1>
        </div>
        <div className="wishlist-loading">Loading...</div>
      </div>
    );
  }

  if (wishlistProducts.length === 0) {
    return (
      <div className="wishlist">
        <div className="wishlist-header">
          <h1>My Wishlist</h1>
        </div>
        <div className="wishlist-empty">
          <p>Your wishlist is empty</p>
          <Link to="/">
            <button className="wishlist-continue-shopping">
              Continue Shopping
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="wishlist">
      <div className="wishlist-header">
        <h1>My Wishlist</h1>
        <p className="wishlist-count">
          {wishlistProducts.length}{" "}
          {wishlistProducts.length === 1 ? "item" : "items"}
        </p>
      </div>

      <div className="wishlist-items">
        {wishlistProducts.map((product) => (
          <div key={product.id} className="wishlist-item">
            <div className="wishlist-item-image">
              <Link to={`/product/${product.id}`}>
                <img src={product.image} alt={product.name} />
              </Link>
            </div>

            <div className="wishlist-item-details">
              <Link
                to={`/product/${product.id}`}
                className="wishlist-item-name"
              >
                <h3>{product.name}</h3>
              </Link>

              <div className="wishlist-item-prices">
                <span className="wishlist-item-price-new">
                  ${product.new_price}
                </span>
                <span className="wishlist-item-price-old">
                  ${product.old_price}
                </span>
              </div>

              <div className="wishlist-item-category">
                Category: {product.category}
              </div>
            </div>

            <div className="wishlist-item-actions">
              <Link to={`/product/${product.id}`}>
                <button className="wishlist-add-to-cart-btn">
                  Select Size & Add to Cart
                </button>
              </Link>

              <button
                className="wishlist-remove-btn"
                onClick={() => removeFromWishlist(product.id)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="wishlist-footer">
        <Link to="/">
          <button className="wishlist-continue-shopping">
            Continue Shopping
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Wishlist;
