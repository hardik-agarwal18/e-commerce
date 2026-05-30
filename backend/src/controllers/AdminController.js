import * as adminService from "../services/admin.service.js";

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const token = await adminService.loginAdmin(email, password);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      token,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      errors: error.message,
    });
  }
};

export const adminLogout = async (req, res) => {
  try {
    await adminService.logoutAdmin();

    res.clearCookie("token");

    return res.status(200).json({
      success: true,
      message: "Admin logged out successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
