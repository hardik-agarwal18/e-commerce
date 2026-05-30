import * as dashboardService from "../services/dashboard.service.js";

export const userCount = async (req, res) => {
  try {
    const result = await dashboardService.getUserCount();

    return res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching user count:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getProductsCount = async (req, res) => {
  try {
    const result = await dashboardService.getProductCount();

    return res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching product count:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    const stats = await dashboardService.getDashboardStats();

    return res.status(200).json(stats);
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
