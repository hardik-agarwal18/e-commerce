import express from "express";

import { isSignedIn } from "../middleware/auth.js";
import { addAddress } from "../controllers/AddressController.js";

import {
  addtowishlist,
  removefromwishlist,
  wishlistItems,
} from "../controllers/WishlistController.js";

const router = express.Router();

//Address
router.post("/add-address", isSignedIn, addAddress);

//Wishlist
router.post("/add-to-wishlist", isSignedIn, addtowishlist);
router.post("/remove-from-wishlist", isSignedIn, removefromwishlist);
router.get("/get-wishlist-items", isSignedIn, wishlistItems);

export default router;
