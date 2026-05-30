import express from "express";
import {
  userCount,
  getProductsCount,
  getDashboardStats,
} from "../controllers/dashboardController.js";

const router = express.Router();

router.get("/users/count", userCount);

router.get("/products/count", getProductsCount);

router.get("/stats", getDashboardStats);

export default router;
