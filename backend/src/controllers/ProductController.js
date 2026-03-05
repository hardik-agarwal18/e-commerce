import Product from "../models/ProductModel.js";
import mongoose from "mongoose";

export const addProduct = async (req, res) => {
  const { name, image, category, new_price, old_price, stock, sizeStock } =
    req.body;

  // Calculate total stock from sizeStock if provided, otherwise use stock
  let totalStock = stock || 0;
  if (sizeStock) {
    totalStock = Object.values(sizeStock).reduce((sum, qty) => sum + qty, 0);
  }

  const product = new Product({
    name: name,
    image: image,
    category: category,
    new_price: new_price,
    old_price: old_price,
    stock: totalStock,
    sizeStock: sizeStock || {
      S: 0,
      M: 0,
      L: 0,
      XL: 0,
      XXL: 0,
    },
    available: totalStock > 0,
  });
  // console.log(product);

  await product.save();
  // console.log("Saved");

  res.json({
    success: true,
    message: "Product Added",
  });
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.body;
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    // console.log("Removed the Product");
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
  // console.log("All Products Fetched");
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

export const updateProduct = async (req, res) => {
  try {
    const {
      id,
      name,
      image,
      category,
      new_price,
      old_price,
      stock,
      sizeStock,
    } = req.body;

    // Validate that id is provided
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    // Find the product by MongoDB _id
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Calculate total stock from sizeStock if provided
    let totalStock = stock || product.stock;
    if (sizeStock) {
      totalStock = Object.values(sizeStock).reduce((sum, qty) => sum + qty, 0);
    }

    // Update fields
    if (name !== undefined) product.name = name;
    if (image !== undefined) product.image = image;
    if (category !== undefined) product.category = category;
    if (new_price !== undefined) product.new_price = new_price;
    if (old_price !== undefined) product.old_price = old_price;
    if (sizeStock !== undefined) product.sizeStock = sizeStock;

    product.stock = totalStock;
    product.available = totalStock > 0;

    await product.save();

    res.json({
      success: true,
      message: "Product Updated Successfully",
      product,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Use MongoDB's findById
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
