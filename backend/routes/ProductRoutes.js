import express from "express";
import {
  addProduct,
  addToCart,
  deleteProduct,
  getAllProducts,
  newCollection,
  popularInWomen,
} from "../controllers/ProductController.js";

const router = express.Router();

//Add Product
router.post("/addproduct", addProduct);
//Get single Product
router.get("/getallproducts", getAllProducts);
//Get All Products
router.post("/removeproduct", deleteProduct);
// Creating endpoint for new collection
router.get("/newcollection", newCollection);
// Creating endpoint for popular in women
router.get("/popularinwomen", popularInWomen);
router.post("/addtocart", addToCart);
export default router;
