import express from "express";
import {
  addProduct,
  deleteProduct,
  getAllProducts,
  newCollection,
  popularInWomen,
} from "../controllers/ProductController.js";

import {
  addtowishlist,
  removefromwishlist,
  wishlistItems,
} from "../controllers/WishlistController.js";

import { isSignedIn } from "../middleware/auth.js";
import isAdmin from "../middleware/admin.js";

const router = express.Router();

//Get All Products
router.get("/getallproducts", getAllProducts);
//Add Product
router.post("/addproduct", isSignedIn, isAdmin, addProduct);
//Remove Product
router.post("/removeproduct", isSignedIn, isAdmin, deleteProduct);
// Creating endpoint for new collection
router.get("/newcollection", newCollection);
// Creating endpoint for popular in women
router.get("/popularinwomen", popularInWomen);

//Wishlist
router.post("/addtowishlist", isSignedIn, addtowishlist);
router.post("/removefromwishlist", isSignedIn, removefromwishlist);
router.get("/wishlistitems", isSignedIn, wishlistItems);

export default router;
