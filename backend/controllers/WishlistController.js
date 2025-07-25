import WishList from "../models/WishListModel.js";

export const addtowishlist = async (req, res) => {
  const { userId, productId } = req.body;

  try {
    let wishlist = await WishList.findOne({ userId });
    if (!wishlist) {
      wishlist = new WishList({ userId, products: [] });
    }

    // Check if the product is already in the wishlist
    const productIndex = wishlist.products.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (productIndex === -1) {
      // If not, add it
      wishlist.products.push({ productId });
    }

    await wishlist.save();

    res.status(200).json({ message: "Product added to wishlist" });
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const removefromwishlist = async (req, res) => {
  const { userId, productId } = req.body;

  try {
    const wishlist = await WishList.findOne({ userId });
    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    // Remove the product from the wishlist
    wishlist.products = wishlist.products.filter(
      (item) => item.productId.toString() !== productId
    );

    await wishlist.save();
    res.status(200).json({ message: "Product removed from wishlist" });
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const wishlistItems = async (req, res) => {
  const { userId } = req.body;

  try {
    const wishlist = await WishList.findOne({ userId }).populate(
      "products.productId"
    );
    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }
    res.status(200).json({ wishlist });
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
