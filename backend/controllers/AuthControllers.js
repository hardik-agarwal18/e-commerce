import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Users from "../models/UserModel.js";

export const signup = async (req, res) => {
  const { name, email, password } = req.body;

  let existingUser = await Users.findOne({ email });

  if (existingUser) {
    return res.status(400).json({ success: false, message: "User Exists" });
  }

  let cart = {};
  for (let i = 0; i < 300; i++) {
    cart[i] = 0;
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = new Users({
    name: name,
    email: email,
    password: hashedPassword,
    cartData: cart,
  });

  await user.save();

  const data = {
    user: {
      id: user.id,
    },
  };

  const token = jwt.sign(data, process.env.JWT_SECRET);

  // Set the token as an HTTP-only cookie
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Use HTTPS in production
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  });

  res.status(200).json({
    success: true,
    token,
    message: "User Created",
  });
};
export const login = async (req, res) => {
  const { email, password } = req.body;

  let user = await Users.findOne({ email });
  if (!user) {
    return res.status(400).json({ success: false, message: "User not exists" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ success: false, message: "Wrong Password" });
  }
  const data = { user: { id: user.id } };

  const token = jwt.sign(data, process.env.JWT_SECRET);

  // Set the token as an HTTP-only cookie
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Use HTTPS in production
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  });

  res.json({ success: true, token, message: "User Logged in" });
};
export const logout = async (req, res) => {
  res.clearCookie("token");
  res.json({ success: true, message: "User logged out successfully" });
};

export const authLogin = async (req, res) => {
  const { email, password } = req.body;

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (email === adminEmail && password === adminPassword) {
    const data = {
      user: {
        id: "admin_user", // A unique identifier for the admin
        role: "admin",
      },
    };
    const token = jwt.sign(data, process.env.JWT_SECRET);
    res.json({ success: true, token });
  } else {
    res.status(400).json({ success: false, errors: "Invalid Credentials" });
  }
};

export const userCount = async (req, res) => {
  try {
    const count = await Users.countDocuments();
    res.status(200).json({ success: true, count });
  } catch (error) {
    console.error("Error fetching user count:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
