import * as wishlistService from "../services/wishlist.service.js";

export const addtowishlist = async (req, res) => {
  try {
    const { productId } = req.body;

    await wishlistService.addToWishlist(req.user.id, productId);

    return res.status(200).json({
      success: true,
      message: "Product added to wishlist",
    });
  } catch (error) {
    if (error.message === "Product not found") {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const removefromwishlist = async (req, res) => {
  try {
    const { productId } = req.body;

    await wishlistService.removeFromWishlist(req.user.id, productId);

    return res.status(200).json({
      success: true,
      message: "Product removed from wishlist",
    });
  } catch (error) {
    if (error.message === "Wishlist not found") {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const wishlistItems = async (req, res) => {
  try {
    const wishlist = await wishlistService.getWishlistItems(req.user.id);

    return res.status(200).json({
      success: true,
      wishlist,
    });
  } catch (error) {
    if (error.message === "Wishlist not found") {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
