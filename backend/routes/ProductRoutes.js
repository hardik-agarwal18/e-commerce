import express from "express";
import {
  addProduct,
  addToCart,
  deleteProduct,
  getAllProducts,
  getCart,
  getProductsCount,
  newCollection,
  popularInWomen,
  removeFromCart,
} from "../controllers/ProductController.js";

import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

//Add Product
router.post("/addproduct", addProduct);
//Get All Products
router.get("/getallproducts", getAllProducts);
//Get All Products Count
router.get("/getallproducts/count", getProductsCount);
//Remove Product
router.post("/removeproduct", deleteProduct);
// Creating endpoint for new collection
router.get("/newcollection", newCollection);
// Creating endpoint for popular in women
router.get("/popularinwomen", popularInWomen);

// Cart routes with authentication
router.post("/addtocart", authenticateToken, addToCart);
router.post("/removefromcart", authenticateToken, removeFromCart);
router.get("/getcart", authenticateToken, getCart);

export default router;
