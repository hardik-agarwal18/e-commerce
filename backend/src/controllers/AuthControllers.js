import jwt from "jsonwebtoken";

import { createUser, loginUser } from "../services/auth.service.js";

const generateToken = (userId) => {
  return jwt.sign(
    {
      user: {
        id: userId,
      },
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    },
  );
};

const setAuthCookie = (res, token) => {
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000,
  });
};

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const user = await createUser({
      name,
      email,
      password,
    });

    const token = generateToken(user.id);

    setAuthCookie(res, token);

    return res.status(201).json({
      success: true,
      token,
      message: "User Created",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await loginUser({
      email,
      password,
    });

    const token = generateToken(user.id);

    setAuthCookie(res, token);

    return res.status(200).json({
      success: true,
      token,
      message: "User Logged in",
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

export const logout = async (req, res) => {
  res.clearCookie("token");

  return res.status(200).json({
    success: true,
    message: "User logged out successfully",
  });
};
