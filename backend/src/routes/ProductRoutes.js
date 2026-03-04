import express from "express";
import {
  addProduct,
  deleteProduct,
  getAllProducts,
  newCollection,
  popularInWomen,
  updateProduct,
  getProductById,
} from "../controllers/ProductController.js";

import { isSignedIn } from "../middleware/auth.js";
import isAdmin from "../middleware/admin.js";

const router = express.Router();

//Get All Products
router.get("/getallproducts", getAllProducts);
//Get Product by ID
router.get("/product/:id", getProductById);
//Add Product
router.post("/addproduct", isSignedIn, isAdmin, addProduct);
//Update Product
router.put("/updateproduct", isSignedIn, isAdmin, updateProduct);
//Remove Product
router.post("/removeproduct", isSignedIn, isAdmin, deleteProduct);
// Creating endpoint for new collection
router.get("/newcollection", newCollection);
// Creating endpoint for popular in women
router.get("/popularinwomen", popularInWomen);

export default router;
