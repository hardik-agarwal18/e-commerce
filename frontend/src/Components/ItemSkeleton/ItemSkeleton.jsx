import React from "react";
import "./ItemSkeleton.css";

const ItemSkeleton = () => {
  return (
    <div className="item-skeleton">
      <div className="skeleton-image"></div>
      <div className="skeleton-text skeleton-title"></div>
      <div className="skeleton-prices">
        <div className="skeleton-text skeleton-price"></div>
        <div className="skeleton-text skeleton-price"></div>
      </div>
    </div>
  );
};

export default ItemSkeleton;
