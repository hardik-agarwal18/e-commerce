import React from "react";
import "./css/Dashboard.css";

const Dashboard = () => {
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
          <p>150</p>
        </div>
        <div className="stat-card">
          <h2>Total Users</h2>
          <p>1,200</p>
        </div>
        <div className="stat-card">
          <h2>Total Orders</h2>
          <p>450</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
