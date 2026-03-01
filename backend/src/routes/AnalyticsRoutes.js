import express from "express";
import {
  getProductsCount,
  userCount,
} from "../controllers/AnalyticsController.js";
import { isSignedIn } from "../middleware/auth.js";
import isAdmin from "../middleware/admin.js";

const router = express.Router();

router.get("/user-count", isSignedIn, isAdmin, userCount);

router.get("/product-count", isSignedIn, isAdmin, getProductsCount);

export default router;
