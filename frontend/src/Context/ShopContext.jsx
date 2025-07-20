import React, { createContext, useState } from "react";
import all_product from "../Assets/all_product";
import { axiosInstance } from "../lib/axios";

export const ShopContext = createContext(null);
//Default value for cart
const getDefaultCart = () => {
  let cart = {};
  for (let index = 0; index < all_product.length + 1; index++) {
    cart[index] = 0;
  }
  return cart;
};

const ShopContextProvider = (props) => {
  const [cartItems, setCartItems] = useState(getDefaultCart());

  const addToCart = async (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
    console.log(cartItems);
    if (localStorage.getItem("auth-token")) {
      try {
        const response = await axiosInstance.post(
          "/api/products/addtocart",
          {
            itemId: itemId,
          },
          {
            headers: {
              "auth-token": localStorage.getItem("auth-token"),
            },
          }
        );
        if (response.data.success) {
          console.log("Product added to cart successfully");
        }
      } catch (error) {
        console.error("Error adding to cart:", error);
      }
    }
  };

  const removeFromCart = async (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
    if (localStorage.getItem("auth-token")) {
      try {
        const response = await axiosInstance.post(
          "/api/products/removefromcart",
          {
            itemId: itemId,
          },
          {
            headers: {
              "auth-token": localStorage.getItem("auth-token"),
            },
          }
        );
        if (response.data.success) {
          console.log("Product removed from cart successfully");
        }
      } catch (error) {
        console.error("Error removing from cart:", error);
      }
    }
  };

  const getTotalcartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        let itemInfo = all_product.find((product) => {
          return product.id === Number(item);
        });
        if (itemInfo) totalAmount += itemInfo.new_price * cartItems[item];
      }
    }
    return totalAmount;
  };

  const getTotalCartItems = () => {
    let totalItems = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        totalItems += cartItems[item];
      }
    }
    return totalItems;
  };

  const contextValue = {
    getTotalCartItems, // Added this function to get total number of items in cart
    getTotalcartAmount, // Added this function to get Total Price
    all_product,
    cartItems,
    addToCart,
    removeFromCart,
  };
  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
