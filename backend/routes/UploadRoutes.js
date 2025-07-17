import express from "express";
import upload from "../middleware/multer.js";
import { uploadImage } from "../controllers/UploadController.js";

const router = express.Router();

router.post("/", upload.single("product"), uploadImage);

export default router;
