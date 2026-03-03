import { useState, useEffect } from "react";
import "./css/Dashboard.css";
import { axiosInstance } from "../../lib/axios";

const Dashboard = () => {
  const [productCount, setProductCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [orderStats, setOrderStats] = useState({
    pending: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    const fetchProductCount = async () => {
      try {
        const response = await axiosInstance.get("/analytics/product-count");
        setProductCount(response.data.count);
      } catch (error) {
        console.error("Error fetching total products:", error);
      }
    };

    const fetchUserCount = async () => {
      try {
        const response = await axiosInstance.get("/analytics/user-count");
        setUserCount(response.data.count);
      } catch (error) {
        console.error("Error fetching total users:", error);
      }
    };

    const fetchOrderStats = async () => {
      try {
        const response = await axiosInstance.get("/orders/admin/all");
        if (response.data.success) {
          const orders = response.data.orders;
          setOrderCount(orders.length);

          const stats = {
            pending: orders.filter((o) => o.status === "pending").length,
            processing: orders.filter((o) => o.status === "processing").length,
            shipped: orders.filter((o) => o.status === "shipped").length,
            delivered: orders.filter((o) => o.status === "delivered").length,
            cancelled: orders.filter((o) => o.status === "cancelled").length,
            totalRevenue: orders
              .filter((o) => o.status !== "cancelled")
              .reduce((sum, order) => sum + order.totalAmount, 0),
          };
          setOrderStats(stats);
        }
      } catch (error) {
        console.error("Error fetching order statistics:", error);
      }
    };

    fetchProductCount();
    fetchUserCount();
    fetchOrderStats();
  }, []);

  return (
    <div className="dashboard">
      <h1>Welcome to the Admin Panel</h1>
      <p>
        This is your dashboard. You can manage products, orders, and view site
        statistics here.
      </p>
      <div className="dashboard-stats">
        <div className="stat-card">
          <h2>Total Products</h2>
          <p>{productCount}</p>
        </div>
        <div className="stat-card">
          <h2>Total Users</h2>
          <p>{userCount}</p>
        </div>
        <div className="stat-card">
          <h2>Total Orders</h2>
          <p>{orderCount}</p>
        </div>
      </div>

      <div className="dashboard-orders-section">
        <h2>Order Statistics</h2>
        <div className="order-stats-grid">
          <div className="order-stat-card pending">
            <h3>Pending Orders</h3>
            <p className="stat-number">{orderStats.pending}</p>
          </div>
          <div className="order-stat-card processing">
            <h3>Processing</h3>
            <p className="stat-number">{orderStats.processing}</p>
          </div>
          <div className="order-stat-card shipped">
            <h3>Shipped</h3>
            <p className="stat-number">{orderStats.shipped}</p>
          </div>
          <div className="order-stat-card delivered">
            <h3>Delivered</h3>
            <p className="stat-number">{orderStats.delivered}</p>
          </div>
          <div className="order-stat-card cancelled">
            <h3>Cancelled</h3>
            <p className="stat-number">{orderStats.cancelled}</p>
          </div>
          <div className="order-stat-card revenue">
            <h3>Total Revenue</h3>
            <p className="stat-number">${orderStats.totalRevenue.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
