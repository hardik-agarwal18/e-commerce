import express from "express";
import {
  addProduct,
  addToCart,
  deleteProduct,
  getAllProducts,
  getCart,
  newCollection,
  popularInWomen,
  removeFromCart,
} from "../controllers/ProductController.js";

import { authenticateToken } from "../middleware/auth.js";
import admin from "../middleware/admin.js";

const router = express.Router();

//Add Product
router.post("/addproduct", authenticateToken, admin, addProduct);
//Get All Products
router.get("/getallproducts", getAllProducts);
//Remove Product
router.post("/removeproduct", authenticateToken, admin, deleteProduct);
// Creating endpoint for new collection
router.get("/newcollection", newCollection);
// Creating endpoint for popular in women
router.get("/popularinwomen", popularInWomen);

// Cart routes with authentication
router.post("/addtocart", authenticateToken, addToCart);
router.post("/removefromcart", authenticateToken, removeFromCart);
router.get("/getcart", authenticateToken, getCart);

export default router;
