import Product from "../models/ProductModel.js";
import Users from "../models/UserModel.js";

export const userCount = async (req, res) => {
  try {
    const count = await Users.countDocuments();
    res.status(200).json({ success: true, count });
  } catch (error) {
    console.error("Error fetching user count:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getProductsCount = async (req, res) => {
  try {
    const count = await Product.countDocuments();
    return res.status(200).json({ success: true, count });
  } catch (error) {
    console.error("Error fetching product count:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
