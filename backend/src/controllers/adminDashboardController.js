import * as dashboardService from "../services/adminDashboard.service.js";

export const getAdminDashboard = async (req, res) => {
  try {
    const dashboard = await dashboardService.getDashboardStats();

    return res.status(200).json({
      success: true,
      dashboard,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to load dashboard",
    });
  }
};
