import express from "express";
import { login, logout, signup } from "../controllers/AuthControllers.js";
import { loginLimiter, signupLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

//Register
router.post("/signup", signupLimiter, signup);
//Login
router.post("/login", loginLimiter, login);
//Logout
router.post("/logout", logout);

export default router;
