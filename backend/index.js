import express from "express";
import multer from "multer";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";

import connectDatabase from "./config/db.js";
import AuthRoutes from "./routes/AuthRoutes.js";
import ProductRoutes from "./routes/ProductRoutes.js";
import UploadRoutes from "./routes/UploadRoutes.js";

dotenv.config();

const PORT = process.env.PORT || 4000;
const app = express();
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    credentials: true,
  })
);

// Database connection with mongodb
connectDatabase();

// Api Creation
app.get("/", (req, res) => {
  res.send("Express App is Running");
});

app.use("/images", express.static("upload/images"));

app.use("/api/auth", AuthRoutes);
app.use("/api/products", ProductRoutes);
app.use("/api/upload", UploadRoutes);

app.listen(PORT, (error) => {
  if (!error) {
    console.log("Server Running on Port " + PORT);
  } else {
    console.log("Error in the Server:" + error);
  }
});
