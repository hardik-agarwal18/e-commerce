import express from "express";
import { adminLogin, adminLogout } from "../controllers/AdminController.js";
import { getAdminDashboard } from "../controllers/adminDashboardController.js";

const router = express.Router();

router.post("/login", adminLogin);
router.post("/logout", adminLogout);
router.get("/dashboard", getAdminDashboard);

export default router;
