import React, { createContext, useState, useEffect } from "react";
import { axiosInstance } from "../lib/axios";
import { toast } from "sonner";

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
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const normalizeCartData = (responseData) => {
    const legacyCart = responseData?.cartData;
    if (
      legacyCart &&
      typeof legacyCart === "object" &&
      Object.keys(legacyCart).length > 0
    ) {
      return legacyCart;
    }

    const products = responseData?.cart?.products;
    if (!Array.isArray(products)) {
      return {};
    }

    return products.reduce((acc, item) => {
      const productId =
        item?.productId?._id || item?.productId?.id || item?.productId;
      const quantity = Number(item?.quantity || 0);
      if (productId && quantity > 0) {
        const key = String(productId);
        acc[key] = (acc[key] || 0) + quantity;
      }
      return acc;
    }, {});
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(
          "/api/products/getallproducts",
        );
        const products = Array.isArray(response.data)
          ? response.data.map((product) => ({
              ...product,
              id: product.id || product._id,
            }))
          : [];
        setAllProduct(products);
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
            setCartItems(normalizeCartData(response.data));
          }
        } catch (error) {
          console.error("Error fetching cart data:", error);
        }
      }
    };

    const fetchWishlistData = async () => {
      if (localStorage.getItem("auth-token")) {
        try {
          const response = await axiosInstance.get(
            "/api/user/get-wishlist-items",
            {
              headers: {
                "auth-token": localStorage.getItem("auth-token"),
              },
            },
          );
          if (response.data.wishlist) {
            const productIds = response.data.wishlist.products.map(
              (item) => item.productId._id || item.productId,
            );
            setWishlistItems(productIds);
          }
        } catch (error) {
          console.error("Error fetching wishlist data:", error);
        }
      }
    };

    fetchProducts();
    fetchCartData();
    fetchWishlistData();
  }, []);

  const addToCart = async (itemId, size = null) => {
    // Update local state
    const cartKey = String(itemId);
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
          setCartItems(normalizeCartData(response.data));
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
    const cartKey = String(itemId);
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
          setCartItems(normalizeCartData(response.data));
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
          return String(product.id) === String(item);
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
          setCartItems(normalizeCartData(response.data));
        }
      } catch (error) {
        console.error("Error refreshing cart:", error);
      }
    }
  };

  const addToWishlist = async (productId) => {
    if (!localStorage.getItem("auth-token")) {
      toast.error("Please login to add items to wishlist");
      return;
    }

    try {
      const response = await axiosInstance.post(
        "/api/user/add-to-wishlist",
        { productId },
        {
          headers: {
            "auth-token": localStorage.getItem("auth-token"),
          },
        },
      );

      if (response.data.message) {
        // Update local state
        setWishlistItems((prev) => {
          if (!prev.includes(productId)) {
            toast.success("Item added to wishlist");
            return [...prev, productId];
          }
          return prev;
        });
      }
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      toast.error("Failed to add item to wishlist");
    }
  };

  const removeFromWishlist = async (productId) => {
    if (!localStorage.getItem("auth-token")) {
      return;
    }

    try {
      const response = await axiosInstance.post(
        "/api/user/remove-from-wishlist",
        { productId },
        {
          headers: {
            "auth-token": localStorage.getItem("auth-token"),
          },
        },
      );

      if (response.data.message) {
        // Update local state
        setWishlistItems((prev) => prev.filter((id) => id !== productId));
        toast.success("Item removed from wishlist");
      }
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      toast.error("Failed to remove item from wishlist");
    }
  };

  const isInWishlist = (productId) => {
    return wishlistItems.includes(productId);
  };

  const getWishlistCount = () => {
    return wishlistItems.length;
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
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    getWishlistCount,
  };
  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
