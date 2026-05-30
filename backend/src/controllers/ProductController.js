import * as productService from "../services/product.service.js";

export const addProduct = async (req, res) => {
  try {
    await productService.createProduct(req.body);

    return res.json({
      success: true,
      message: "Product Added",
    });
  } catch (error) {
    console.error("Error adding product:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.body;

    const product = await productService.removeProduct(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.json({
      success: true,
      message: "Removed the Product",
      name: product.name,
    });
  } catch (error) {
    console.error("Error deleting product:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const products = await productService.fetchAllProducts();

    return res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const newCollection = async (req, res) => {
  try {
    const newcollection = await productService.fetchNewCollection();

    return res.status(200).json({
      newcollection,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const popularInWomen = async (req, res) => {
  try {
    const popularinwomen = await productService.fetchPopularWomenProducts();

    return res.status(200).json({
      popularinwomen,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    const product = await productService.updateProductById(req.body);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.json({
      success: true,
      message: "Product Updated Successfully",
      product,
    });
  } catch (error) {
    console.error("Error updating product:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await productService.fetchProductById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("Error fetching product:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
