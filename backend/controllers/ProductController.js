import Product from "../models/ProductModel.js";
import Users from "../models/UserModel.js";

export const addProduct = async (req, res) => {
  const { name, image, category, new_price, old_price } = req.body;

  let products = await Product.find({});
  let id;
  if (products.length > 0) {
    let last_product_array = products.slice(-1);
    id = last_product_array[0].id + 1; // last product's id
  } else {
    id = 1;
  }
  const product = new Product({
    id: id,
    name: name,
    image: image,
    category: category,
    new_price: new_price,
    old_price: old_price,
  });
  console.log(product);

  await product.save();
  console.log("Saved");

  res.json({
    success: true,
    message: "Product Added",
  });
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.body;
    const product = await Product.findOneAndDelete({ id });
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    console.log("Removed the Product");
    res.json({
      success: true,
      message: "Removed the Product",
      name: product.name,
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
export const getAllProducts = async (req, res) => {
  let products = await Product.find({});
  console.log("All Products Fetched");
  res.send(products);
};

export const newCollection = async (req, res) => {
  let products = await Product.find({});

  let newcollection = products.slice(1).slice(-8);
  if (newcollection) {
    return res.status(200).json({ newcollection });
  }
};

export const popularInWomen = async (req, res) => {
  const products = await Product.find({ category: "women" });
  let popularinwomen = products.slice(1).slice(-4);
  if (popularinwomen) {
    return res.status(200).json({ popularinwomen });
  }
};

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
