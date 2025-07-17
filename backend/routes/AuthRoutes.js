import express from "express";
import { login, logout, signup } from "../controllers/AuthControllers.js";

const router = express.Router();

//Register
router.post("/signup", signup);
//Login
router.post("/login", login);
//Logout
router.post("/logout", logout);

export default router;
