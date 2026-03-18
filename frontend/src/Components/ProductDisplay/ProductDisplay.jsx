import React, { useContext, useState } from "react";
import "./ProductDisplay.css";
import star_icon from "../../Assets/star_icon.png";
import star_dull_icon from "../../Assets/star_dull_icon.png";
import { ShopContext } from "../../Context/ShopContext";

const ProductDisplay = (props) => {
  const { product } = props;
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } =
    useContext(ShopContext);
  const [selectedSize, setSelectedSize] = useState("");
  const [sizeError, setSizeError] = useState("");

  if (!product) {
    return null;
  }

  const inWishlist = isInWishlist(product.id);

  const sizes = ["S", "M", "L", "XL", "XXL"];

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
    setSizeError("");
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      setSizeError("Please select a size");
      return;
    }

    // Check if size is in stock
    if (product.sizeStock && product.sizeStock[selectedSize] <= 0) {
      setSizeError(`Size ${selectedSize} is out of stock`);
      return;
    }

    addToCart(product.id, selectedSize);
    setSizeError("");
  };

  const getSizeStock = (size) => {
    if (product.sizeStock && product.sizeStock[size] !== undefined) {
      return product.sizeStock[size];
    }
    return 0;
  };

  const handleWishlistToggle = () => {
    if (inWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product.id);
    }
  };

  return (
    <div className="productdisplay">
      <div className="productdisplay-left">
        <div className="productdisplay-img-list">
          <img src={product.image} alt="" />
          <img src={product.image} alt="" />
          <img src={product.image} alt="" />
          <img src={product.image} alt="" />
        </div>
        <div className="productdisplay-img">
          <img
            className="productdisplay-main-img"
            src={product.image}
            alt="/"
          />
        </div>
      </div>
      <div className="productdisplay-right">
        <h1>{product.name}</h1>
        <div className="productdisplay-price">
          <img src={star_icon} alt="" />
          <img src={star_icon} alt="" />
          <img src={star_icon} alt="" />
          <img src={star_icon} alt="" />
          <img src={star_dull_icon} alt="" />
          <p>(122)</p>
        </div>
        <div className="productdisplay-right-prices">
          <div className="productdisplay-right-prices-old">
            ${product.old_price}
          </div>
          <div className="productdisplay-right-prices-new">
            ${product.new_price}
          </div>
        </div>
        <div className="productdisplay-right-description">
          A lightweight, usually knitted, pullover sgirt, close fitting and with
          a round neckline and short sleeves, worn as an undershirt or outer
          garment.
        </div>
        <div className="productdisplay-right-size">
          <h1>Select Size</h1>
          <div className="productdisplay-right-sizes">
            {sizes.map((size) => {
              const stock = getSizeStock(size);
              const isOutOfStock = stock <= 0;
              const isLowStock = stock > 0 && stock <= 5;
              return (
                <div
                  key={size}
                  className={`size-option ${selectedSize === size ? "selected" : ""} ${isOutOfStock ? "out-of-stock" : ""} ${isLowStock ? "low-stock" : ""}`}
                  onClick={() => !isOutOfStock && handleSizeSelect(size)}
                  title={isOutOfStock ? "Out of stock" : `${stock} in stock`}
                >
                  <span className="size-label">{size}</span>
                  {!isOutOfStock && (
                    <span className="stock-count">{stock}</span>
                  )}
                  {isOutOfStock && (
                    <span className="sold-out-badge">Sold Out</span>
                  )}
                </div>
              );
            })}
          </div>
          {sizeError && <p className="size-error">{sizeError}</p>}
        </div>
        <div className="productdisplay-buttons">
          <button className="add-to-cart-btn" onClick={handleAddToCart}>
            ADD TO CART
          </button>
          <button
            className={`wishlist-btn ${inWishlist ? "in-wishlist" : ""}`}
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
            <span>{inWishlist ? "IN WISHLIST" : "ADD TO WISHLIST"}</span>
          </button>
        </div>
        <p className="productdisplay-right-category">
          <span>Category:</span> Women, T-Shirt, Crop Top
        </p>
        <p className="productdisplay-right-category">
          <span>Tags:</span> Modern, Latest
        </p>
      </div>
    </div>
  );
};

export default ProductDisplay;
