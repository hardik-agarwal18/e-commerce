import React, { useContext } from "react";
import "./CSS/ShopCategory.css";
import { ShopContext } from "../Context/ShopContext";
import dropdown_icon from "../Assets/dropdown_icon.png";
import Item from "../Components/Item/Item";
import ItemSkeleton from "../Components/ItemSkeleton/ItemSkeleton";

const ShopCategory = (props) => {
  const { all_product, loading } = useContext(ShopContext);

  const filteredProducts = all_product.filter(
    (item) => props.category === item.category
  );

  return (
    <div className="shop-category">
      <img className="shopcategory-banner" src={props.banner} alt="banner" />
      <div className="shopcategory-indexsort">
        <p>
          <span>Showing 1-{loading ? "..." : filteredProducts.length}</span> out
          of {loading ? "..." : filteredProducts.length} products
        </p>
        <div className="shopcategory-sort">
          Sort by <img src={dropdown_icon} alt="/" />
        </div>
      </div>
      <div className="shopcategory-products">
        {loading
          ? Array(12)
              .fill(0)
              .map((_, i) => <ItemSkeleton key={i} />)
          : filteredProducts.map((item, i) => {
              return (
                <Item
                  key={i}
                  id={item.id}
                  name={item.name}
                  image={item.image}
                  new_price={item.new_price}
                  old_price={item.old_price}
                />
              );
            })}
      </div>
      <div className="shopcategory-loadmore">Explore More...</div>
    </div>
  );
};

export default ShopCategory;
