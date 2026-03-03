import express from "express";
import {
  createOrder,
  getUserOrders,
  getOrderById,
  cancelOrder,
  updateOrderStatus,
  getAllOrders,
} from "../controllers/OrderController.js";
import { isSignedIn } from "../middleware/auth.js";
import { admin } from "../middleware/admin.js";

const router = express.Router();

// User routes
router.post("/create", isSignedIn, createOrder);
router.get("/my-orders", isSignedIn, getUserOrders);
router.get("/:orderId", isSignedIn, getOrderById);
router.put("/:orderId/cancel", isSignedIn, cancelOrder);

// Admin routes
router.get("/admin/all", isSignedIn, admin, getAllOrders);
router.put("/admin/:orderId/status", isSignedIn, admin, updateOrderStatus);

export default router;
