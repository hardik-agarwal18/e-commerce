import React from "react";
import "./NewCollections.css";
import Item from "../Item/Item";
import { useState } from "react";
import { useEffect } from "react";
import { axiosInstance } from "../../lib/axios";

const NewCollections = () => {
  const [new_collections, setNewCollections] = useState([]);

  useEffect(() => {
    const fetchNewCollections = async () => {
      try {
        const response = await axiosInstance.get("/api/products/newcollection");
        if (response.data && response.data.newcollection) {
          setNewCollections(response.data.newcollection);
        }
      } catch (error) {
        console.error("Error fetching new collections:", error);
      }
    };

    fetchNewCollections();
  }, []);
  return (
    <div className="new-collections">
      <h1>NEW COLLECTIONS</h1>
      <hr />
      <div className="collections">
        {new_collections.map((item, i) => {
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

export default NewCollections;
