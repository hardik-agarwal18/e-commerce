import express from "express";
import {
  addProduct,
  deleteProduct,
  getAllProducts,
  newCollection,
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

export default router;
