import express from "express";
import {
  getProductsCount,
  userCount,
} from "../controllers/AnalyticsController.js";
import { authenticateToken } from "../middleware/auth.js";
import admin from "../middleware/admin.js";

const router = express.Router();

router.get("/user-count", authenticateToken, admin, userCount);

router.get("/product-count", authenticateToken, admin, getProductsCount);

export default router;
