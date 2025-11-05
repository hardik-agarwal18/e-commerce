import React from "react";
import "./Popular.css";
import Item from "../Item/Item";
import ItemSkeleton from "../ItemSkeleton/ItemSkeleton";
import { useState } from "react";
import { useEffect } from "react";
import { axiosInstance } from "../../lib/axios";

const Popular = () => {
  const [popularProducts, setPopularProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNewCollections = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(
          "/api/products/popularinwomen"
        );
        if (response.data && response.data.popularinwomen) {
          setPopularProducts(response.data.popularinwomen);
        }
      } catch (error) {
        console.error("Error fetching new collections:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNewCollections();
  }, []);

  return (
    <div className="popular">
      <h1>POPULAR IN WOMEN</h1>
      <hr />
      <div className="popular-item">
        {loading
          ? Array(4)
              .fill(0)
              .map((_, i) => <ItemSkeleton key={i} />)
          : popularProducts.map((item, i) => {
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
    </div>
  );
};

export default Popular;
