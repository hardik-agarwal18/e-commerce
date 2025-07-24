import { useState, useEffect } from "react";
import "./css/Dashboard.css";
import { axiosInstance } from "../../lib/axios";

const Dashboard = () => {
  const [productCount, setProductCount] = useState(0);
  const [userCount, setUserCount] = useState(0); // Placeholder for user count
  // const [orderCount, setOrderCount] = useState(0); // Placeholder for order count

  useEffect(() => {
    const fetchProductCount = async () => {
      try {
        const response = await axiosInstance.get(
          "/products/getallproducts/count"
        );
        setProductCount(response.data.count);
      } catch (error) {
        console.error("Error fetching total products:", error);
      }
    };

    const fetchUserCount = async () => {
      try {
        const response = await axiosInstance.get("/auth/admin/usercount");
        setUserCount(response.data.count);
      } catch (error) {
        console.error("Error fetching total users:", error);
      }
    };
    // For now, we'll just call the product fetch
    fetchProductCount();
    fetchUserCount();
  }, []); // The empty array ensures this runs only once when the component mounts

  return (
    <div className="dashboard">
      <h1>Welcome to the Admin Panel</h1>
      <p>
        This is your dashboard. You can manage products and view site statistics
        here.
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
          <p>0</p>
          {/* This will be 0 until you implement the fetch */}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
