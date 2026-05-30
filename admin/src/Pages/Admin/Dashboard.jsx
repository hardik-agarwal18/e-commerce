import { useEffect, useState } from "react";
import { axiosInstance } from "../../lib/axios";
import "./css/Dashboard.css";

const Dashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      const { data } = await axiosInstance.get("/admin/dashboard");

      setDashboard(data.dashboard);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return <div className="dashboard-loading">Loading Dashboard... </div>;
  }

  const {
    overview,
    orders,
    usersStats,
    productsStats,
    revenue,
    averageOrderValue,
    topSellingProducts,
    recentOrders,
  } = dashboard;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Monitor sales, orders, products and users.</p>
      </div>

      {/* Overview */}

      <div className="stats-grid">
        <div className="card">
          <h3>Total Revenue</h3>
          <p>₹{overview.revenue.toLocaleString()}</p>
        </div>

        <div className="card">
          <h3>Total Orders</h3>
          <p>{overview.orders}</p>
        </div>

        <div className="card">
          <h3>Total Products</h3>
          <p>{overview.products}</p>
        </div>

        <div className="card">
          <h3>Total Users</h3>
          <p>{overview.users}</p>
        </div>
      </div>

      {/* Revenue */}

      <div className="section">
        <h2>Revenue Analytics</h2>

        <div className="stats-grid">
          <div className="card">
            <h3>Today</h3>
            <p>₹{revenue.today}</p>
          </div>

          <div className="card">
            <h3>Weekly</h3>
            <p>₹{revenue.weekly}</p>
          </div>

          <div className="card">
            <h3>Monthly</h3>
            <p>₹{revenue.monthly}</p>
          </div>

          <div className="card">
            <h3>Average Order Value</h3>
            <p>₹{averageOrderValue.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Orders */}

      <div className="section">
        <h2>Order Status</h2>

        <div className="stats-grid">
          <div className="card pending">
            <h3>Pending</h3>
            <p>{orders.pendingOrders}</p>
          </div>

          <div className="card processing">
            <h3>Processing</h3>
            <p>{orders.processingOrders}</p>
          </div>

          <div className="card shipped">
            <h3>Shipped</h3>
            <p>{orders.shippedOrders}</p>
          </div>

          <div className="card delivered">
            <h3>Delivered</h3>
            <p>{orders.deliveredOrders}</p>
          </div>

          <div className="card cancelled">
            <h3>Cancelled</h3>
            <p>{orders.cancelledOrders}</p>
          </div>
        </div>
      </div>

      {/* Inventory */}

      <div className="section">
        <h2>Inventory</h2>

        <div className="stats-grid">
          <div className="card">
            <h3>In Stock</h3>
            <p>{productsStats.inStockProducts}</p>
          </div>

          <div className="card">
            <h3>Low Stock</h3>
            <p>{productsStats.lowStockProducts}</p>
          </div>

          <div className="card">
            <h3>Out Of Stock</h3>
            <p>{productsStats.outOfStockProducts}</p>
          </div>
        </div>
      </div>

      {/* Top Products */}

      <div className="section">
        <h2>Top Selling Products</h2>

        <div className="top-products">
          {topSellingProducts.map((item) => (
            <div key={item.productId} className="top-product">
              <span>{item.product?.name}</span>

              <span>{item._sum.quantity} sold</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Orders */}

      <div className="section">
        <h2>Recent Orders</h2>

        <div className="orders-table">
          <table>
            <thead>
              <tr>
                <th>Order</th>
                <th>User</th>
                <th>Status</th>
                <th>Amount</th>
              </tr>
            </thead>

            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id}>
                  <td>{order.orderNumber}</td>

                  <td>{order.user?.name}</td>

                  <td>{order.status}</td>

                  <td>₹{Number(order.totalAmount).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
