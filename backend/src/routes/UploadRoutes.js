import express from "express";
import upload from "../middleware/multer.js";
import { uploadImage } from "../controllers/UploadController.js";
import { isSignedIn } from "../middleware/auth.js";
import isAdmin from "../middleware/admin.js";

const router = express.Router();

router.post("/", isSignedIn, isAdmin, upload.single("product"), uploadImage);

export default router;
