import * as cartService from "../services/cart.service.js";

export const addToCart = async (req, res) => {
  try {
    const { itemId, size, quantity } = req.body;

    const cart = await cartService.addToCart(
      req.user.id,
      itemId,
      size,
      quantity,
    );

    return res.json({
      success: true,
      message: "Product added to cart",
      cart,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { itemId, size, quantity } = req.body;

    const cart = await cartService.removeFromCart(
      req.user.id,
      itemId,
      size,
      quantity,
    );

    return res.json({
      success: true,
      message: "Product removed from cart",
      cart,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getCart = async (req, res) => {
  try {
    const cart = await cartService.getCart(req.user.id);

    return res.json({
      success: true,
      cart,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const clearCart = async (req, res) => {
  try {
    await cartService.clearCart(req.user.id);

    return res.json({
      success: true,
      message: "Cart cleared successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateCartItemQuantity = async (req, res) => {
  try {
    const { itemId, size, quantity } = req.body;

    const cart = await cartService.updateCartItemQuantity(
      req.user.id,
      itemId,
      size,
      quantity,
    );

    return res.json({
      success: true,
      message: "Cart updated successfully",
      cart,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
