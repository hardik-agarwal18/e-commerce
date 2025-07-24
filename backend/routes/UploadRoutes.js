import express from "express";
import upload from "../middleware/multer.js";
import { uploadImage } from "../controllers/UploadController.js";
import { authenticateToken } from "../middleware/auth.js";
import admin from "../middleware/admin.js";

const router = express.Router();

router.post(
  "/",
  authenticateToken,
  admin,
  upload.single("product"),
  uploadImage
);

export default router;
