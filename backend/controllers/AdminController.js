import jwt from "jsonwebtoken";

export const adminLogin = async (req, res) => {
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

export const adminLogout = async (req, res) => {
  res.clearCookie("token");
  res.json({ success: true, message: "User logged out successfully" });
};
