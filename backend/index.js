import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";

import connectDatabase from "./config/db.js";
import AuthRoutes from "./routes/AuthRoutes.js";
import ProductRoutes from "./routes/ProductRoutes.js";
import UploadRoutes from "./routes/UploadRoutes.js";
import AdminRoutes from "./routes/AdminRoutes.js";
import AnalyticsRoutes from "./routes/AnalyticsRoutes.js";
import CartRoutes from "./routes/CartRoutes.js";
import UserRoutes from "./routes/UserRoutes.js";
import { globalLimiter } from "./middleware/rateLimiter.js";

dotenv.config();

const PORT = process.env.PORT || 4000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      "https://e-commerce-1l6z.vercel.app",
      "https://ecommerce.hardik-agarwa18.xyz",
      "https://admin-ecommerce.hardik-agarwal18.xyz",
    ],
    credentials: true,
  })
);
app.use(morgan("dev"));

// Database connection with mongodb
connectDatabase();

// Api Creation
app.get("/", (req, res) => {
  res.send("Express App is Running");
});

// Static file serving - kept active for backward compatibility with existing images
// app.use("/images", express.static("upload/images"));

app.use("/api/auth", AuthRoutes);
app.use("/api/products", ProductRoutes);
app.use("/api/upload", UploadRoutes);
app.use("/api/admin", AdminRoutes);
app.use("/api/analytics", AnalyticsRoutes);
app.use("/api/cart", CartRoutes);
app.use("/api/user", UserRoutes);

app.use(globalLimiter);

app.listen(PORT, (error) => {
  if (!error) {
    console.log("Server Running on Port " + PORT);
  } else {
    console.log("Error in the Server:" + error);
  }
});
