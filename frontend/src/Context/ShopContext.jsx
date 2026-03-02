import React, { createContext, useState, useEffect } from "react";
import { axiosInstance } from "../lib/axios";

export const ShopContext = createContext(null);

//Default value for cart
const getDefaultCart = () => {
  let cart = {};
  // Initialize with empty cart - will be populated as needed
  return cart;
};

const ShopContextProvider = (props) => {
  const [all_product, setAllProduct] = useState([]);
  const [cartItems, setCartItems] = useState(getDefaultCart());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(
          "/api/products/getallproducts",
        );
        setAllProduct(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchCartData = async () => {
      if (localStorage.getItem("auth-token")) {
        try {
          const response = await axiosInstance.get("/api/cart/getcart", {
            headers: {
              "auth-token": localStorage.getItem("auth-token"),
            },
          });
          if (response.data.success) {
            setCartItems(response.data.cartData);
          }
        } catch (error) {
          console.error("Error fetching cart data:", error);
        }
      }
    };

    fetchProducts();
    fetchCartData();
  }, []);

  const addToCart = async (itemId, size = null) => {
    // Update local state
    const cartKey = size ? `${itemId}_${size}` : itemId;
    setCartItems((prev) => ({
      ...prev,
      [cartKey]: (prev[cartKey] || 0) + 1,
    }));

    if (localStorage.getItem("auth-token")) {
      try {
        const requestBody = { itemId: itemId };
        if (size) {
          requestBody.size = size;
        }

        const response = await axiosInstance.post(
          "/api/cart/addtocart",
          requestBody,
          {
            headers: {
              "auth-token": localStorage.getItem("auth-token"),
            },
          },
        );
        if (response.data.success) {
          console.log("Product added to cart successfully");
        }
      } catch (error) {
        console.error("Error adding to cart:", error);
        // Revert local state on error
        setCartItems((prev) => ({
          ...prev,
          [cartKey]: Math.max((prev[cartKey] || 0) - 1, 0),
        }));
      }
    }
  };

  const removeFromCart = async (itemId, size = null) => {
    // Update local state
    const cartKey = size ? `${itemId}_${size}` : itemId;
    setCartItems((prev) => ({
      ...prev,
      [cartKey]: Math.max((prev[cartKey] || 0) - 1, 0),
    }));

    if (localStorage.getItem("auth-token")) {
      try {
        const requestBody = { itemId: itemId };
        if (size) {
          requestBody.size = size;
        }

        const response = await axiosInstance.post(
          "/api/cart/removefromcart",
          requestBody,
          {
            headers: {
              "auth-token": localStorage.getItem("auth-token"),
            },
          },
        );
        if (response.data.success) {
          console.log("Product removed from cart successfully");
        }
      } catch (error) {
        console.error("Error removing from cart:", error);
        // Revert local state on error
        setCartItems((prev) => ({
          ...prev,
          [cartKey]: (prev[cartKey] || 0) + 1,
        }));
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

  const refreshCart = async () => {
    if (localStorage.getItem("auth-token")) {
      try {
        const response = await axiosInstance.get("/api/cart/getcart", {
          headers: {
            "auth-token": localStorage.getItem("auth-token"),
          },
        });
        if (response.data.success) {
          setCartItems(response.data.cartData);
        }
      } catch (error) {
        console.error("Error refreshing cart:", error);
      }
    }
  };

  const contextValue = {
    getTotalCartItems, // Added this function to get total number of items in cart
    getTotalcartAmount, // Added this function to get Total Price
    all_product,
    cartItems,
    addToCart,
    removeFromCart,
    refreshCart, // Added function to refresh cart data
    loading, // Added loading state
  };
  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
