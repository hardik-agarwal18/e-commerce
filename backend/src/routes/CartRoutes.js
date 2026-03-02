import express from "express";
import { isSignedIn } from "../middleware/auth.js";
import {
  addToCart,
  getCart,
  removeFromCart,
  clearCart,
  updateCartItemQuantity,
} from "../controllers/CartController.js";

const router = express.Router();

// Cart routes with authentication
router.post("/addtocart", isSignedIn, addToCart);
router.post("/removefromcart", isSignedIn, removeFromCart);
router.get("/getcart", isSignedIn, getCart);
router.post("/clearcart", isSignedIn, clearCart);
router.put("/updatecart", isSignedIn, updateCartItemQuantity);

export default router;
