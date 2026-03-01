import Product from "../models/ProductModel.js";
import Users from "../models/UserModel.js";
import Cart from "../models/CartModel.js";

export const addToCart = async (req, res) => {
  try {
    console.log("Add to cart request:", req.body);
    const { itemId, size, quantity = 1 } = req.body;
    const userId = req.user.id;

    // Find the user
    const user = await Users.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Find the product
    const product = await Product.findById(itemId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Check stock availability
    if (product.stock <= 0) {
      return res
        .status(400)
        .json({ success: false, message: "Product is out of stock" });
    }

    if (product.available === false) {
      return res
        .status(400)
        .json({ success: false, message: "Product is not available" });
    }

    // Check if requested quantity is available
    if (quantity > product.stock) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.stock} items available in stock`,
      });
    }

    // Update User's cartData (backward compatibility)
    if (!user.cartData) {
      user.cartData = {};
    }

    if (user.cartData[itemId]) {
      user.cartData[itemId] += quantity;
    } else {
      user.cartData[itemId] = quantity;
    }

    // Update/Create Cart in separate Cart model
    let cart = await Cart.findOne({ userId: userId });

    if (!cart) {
      // Create new cart
      cart = new Cart({
        userId: userId,
        products: [
          {
            productId: itemId,
            quantity: quantity,
            price: product.new_price,
            size: size || null,
          },
        ],
        totalAmount: product.new_price * quantity,
      });
    } else {
      // Update existing cart
      const existingProductIndex = cart.products.findIndex(
        (p) => p.productId.toString() === itemId && p.size === (size || null)
      );

      if (existingProductIndex > -1) {
        // Update existing product
        cart.products[existingProductIndex].quantity += quantity;
        cart.products[existingProductIndex].price = product.new_price; // Update to current price
      } else {
        // Add new product
        cart.products.push({
          productId: itemId,
          quantity: quantity,
          price: product.new_price,
          size: size || null,
        });
      }

      // Recalculate total amount
      cart.totalAmount = cart.products.reduce(
        (total, product) => total + product.price * product.quantity,
        0
      );
    }

    // Save both models
    await Promise.all([
      Users.findByIdAndUpdate(userId, { cartData: user.cartData }),
      cart.save(),
    ]);

    console.log("Cart updated successfully");
    res.json({
      success: true,
      message: "Product added to cart",
      cartData: user.cartData,
      cart: cart,
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
    const { itemId, size, quantity = 1 } = req.body;
    const userId = req.user.id;

    // Find the user
    const user = await Users.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Update User's cartData (backward compatibility)
    if (!user.cartData) {
      user.cartData = {};
    }

    if (user.cartData[itemId] && user.cartData[itemId] > 0) {
      user.cartData[itemId] -= quantity;

      // Remove item if quantity becomes 0 or less
      if (user.cartData[itemId] <= 0) {
        delete user.cartData[itemId];
      }
    }

    // Update Cart in separate Cart model
    const cart = await Cart.findOne({ userId: userId });

    if (cart) {
      const productIndex = cart.products.findIndex(
        (p) => p.productId.toString() === itemId && p.size === (size || null)
      );

      if (productIndex > -1) {
        cart.products[productIndex].quantity -= quantity;

        // Remove product if quantity becomes 0 or less
        if (cart.products[productIndex].quantity <= 0) {
          cart.products.splice(productIndex, 1);
        }

        // Recalculate total amount
        cart.totalAmount = cart.products.reduce(
          (total, product) => total + product.price * product.quantity,
          0
        );

        // Save cart or delete if empty
        if (cart.products.length === 0) {
          await Cart.findByIdAndDelete(cart._id);
        } else {
          await cart.save();
        }
      }
    }

    // Save user cartData
    await Users.findByIdAndUpdate(userId, { cartData: user.cartData });

    console.log("Cart updated successfully");
    res.json({
      success: true,
      message: "Product removed from cart",
      cartData: user.cartData,
      cart: await Cart.findOne({ userId: userId }),
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

    // Get cart from separate Cart model with populated product details
    const cart = await Cart.findOne({ userId: userId }).populate({
      path: "products.productId",
      model: "Product",
    });

    res.json({
      success: true,
      cartData: user.cartData || {}, // Legacy format
      cart: cart || null, // New structured format with full product details
    });
  } catch (error) {
    console.error("Error getting cart:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Clear entire cart
export const clearCart = async (req, res) => {
  try {
    const userId = req.user.id;

    // Clear both cart formats
    await Promise.all([
      Users.findByIdAndUpdate(userId, { cartData: {} }),
      Cart.findOneAndDelete({ userId: userId }),
    ]);

    res.json({
      success: true,
      message: "Cart cleared successfully",
    });
  } catch (error) {
    console.error("Error clearing cart:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Update cart item quantity
export const updateCartItemQuantity = async (req, res) => {
  try {
    const { itemId, size, quantity } = req.body;
    const userId = req.user.id;

    if (quantity < 0) {
      return res.status(400).json({
        success: false,
        message: "Quantity cannot be negative",
      });
    }

    // Find product to validate stock
    const product = await Product.findById(itemId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (quantity > product.stock) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.stock} items available in stock`,
      });
    }

    // Update User's cartData
    const user = await Users.findById(userId);
    if (!user.cartData) {
      user.cartData = {};
    }

    if (quantity === 0) {
      delete user.cartData[itemId];
    } else {
      user.cartData[itemId] = quantity;
    }

    // Update Cart model
    const cart = await Cart.findOne({ userId: userId });
    if (cart) {
      const productIndex = cart.products.findIndex(
        (p) => p.productId.toString() === itemId && p.size === (size || null)
      );

      if (productIndex > -1) {
        if (quantity === 0) {
          cart.products.splice(productIndex, 1);
        } else {
          cart.products[productIndex].quantity = quantity;
          cart.products[productIndex].price = product.new_price; // Update to current price
        }

        // Recalculate total
        cart.totalAmount = cart.products.reduce(
          (total, product) => total + product.price * product.quantity,
          0
        );

        if (cart.products.length === 0) {
          await Cart.findByIdAndDelete(cart._id);
        } else {
          await cart.save();
        }
      }
    }

    // Save user data
    await Users.findByIdAndUpdate(userId, { cartData: user.cartData });

    res.json({
      success: true,
      message: "Cart updated successfully",
      cartData: user.cartData,
      cart: await Cart.findOne({ userId: userId }),
    });
  } catch (error) {
    console.error("Error updating cart:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
