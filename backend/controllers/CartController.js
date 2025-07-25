import Users from "../models/UserModel.js";

export const addToCart = async (req, res) => {
  try {
    console.log("Add to cart request:", req.body);
    const { itemId } = req.body;
    const userId = req.user.id;

    // Find the user
    const user = await Users.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Initialize cartData if it doesn't exist
    if (!user.cartData) {
      user.cartData = {};
    }

    // Update cart data
    if (user.cartData[itemId]) {
      user.cartData[itemId] += 1;
    } else {
      user.cartData[itemId] = 1;
    }

    // Save updated cart
    await Users.findByIdAndUpdate(userId, { cartData: user.cartData });

    console.log("Cart updated successfully");
    res.json({
      success: true,
      message: "Product added to cart",
      cartData: user.cartData,
    });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    console.log("Remove from cart request:", req.body);
    const { itemId } = req.body;
    const userId = req.user.id;

    // Find the user
    const user = await Users.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Initialize cartData if it doesn't exist
    if (!user.cartData) {
      user.cartData = {};
    }

    // Update cart data
    if (user.cartData[itemId] && user.cartData[itemId] > 0) {
      user.cartData[itemId] -= 1;

      // Remove item if quantity becomes 0
      if (user.cartData[itemId] === 0) {
        delete user.cartData[itemId];
      }
    }

    // Save updated cart
    await Users.findByIdAndUpdate(userId, { cartData: user.cartData });

    console.log("Cart updated successfully");
    res.json({
      success: true,
      message: "Product removed from cart",
      cartData: user.cartData,
    });
  } catch (error) {
    console.error("Error removing from cart:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getCart = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find the user
    const user = await Users.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      cartData: user.cartData || {},
    });
  } catch (error) {
    console.error("Error getting cart:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
