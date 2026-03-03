import { useEffect, useState, useCallback } from "react";
import "./OrderManagement.css";
import { axiosInstance } from "../../lib/axios";

const OrderManagement = () => {
  const [allOrders, setAllOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [statistics, setStatistics] = useState({
    total: 0,
    pending: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
    totalRevenue: 0,
  });

  const calculateStatistics = useCallback((orders) => {
    const stats = {
      total: orders.length,
      pending: orders.filter((o) => o.status === "pending").length,
      processing: orders.filter((o) => o.status === "processing").length,
      shipped: orders.filter((o) => o.status === "shipped").length,
      delivered: orders.filter((o) => o.status === "delivered").length,
      cancelled: orders.filter((o) => o.status === "cancelled").length,
      totalRevenue: orders
        .filter((o) => o.status !== "cancelled")
        .reduce((sum, order) => sum + order.totalAmount, 0),
    };
    setStatistics(stats);
  }, []);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/orders/admin/all");
      if (response.data.success) {
        const orders = response.data.orders;
        setAllOrders(orders);
        setFilteredOrders(orders);
        calculateStatistics(orders);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      alert("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  }, [calculateStatistics]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  useEffect(() => {
    let filtered = allOrders;

    // Filter by status
    if (filterStatus !== "all") {
      filtered = filtered.filter((order) => order.status === filterStatus);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (order) =>
          order._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.userId?.email
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          order.userId?.name?.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    setFilteredOrders(filtered);
  }, [filterStatus, searchQuery, allOrders]);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await axiosInstance.put(
        `/orders/admin/${orderId}/status`,
        { status: newStatus },
      );

      if (response.data.success) {
        alert("Order status updated successfully");
        await fetchOrders();
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Failed to update order status");
    }
  };

  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const getStatusBadgeClass = (status) => {
    const classes = {
      pending: "status-pending",
      processing: "status-processing",
      shipped: "status-shipped",
      delivered: "status-delivered",
      cancelled: "status-cancelled",
    };
    return classes[status] || "";
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="order-management">
      <h1>Order Management</h1>

      {/* Statistics Dashboard */}
      <div className="order-statistics">
        <div className="stat-card">
          <h3>Total Orders</h3>
          <p className="stat-number">{statistics.total}</p>
        </div>
        <div className="stat-card pending">
          <h3>Pending</h3>
          <p className="stat-number">{statistics.pending}</p>
        </div>
        <div className="stat-card processing">
          <h3>Processing</h3>
          <p className="stat-number">{statistics.processing}</p>
        </div>
        <div className="stat-card shipped">
          <h3>Shipped</h3>
          <p className="stat-number">{statistics.shipped}</p>
        </div>
        <div className="stat-card delivered">
          <h3>Delivered</h3>
          <p className="stat-number">{statistics.delivered}</p>
        </div>
        <div className="stat-card cancelled">
          <h3>Cancelled</h3>
          <p className="stat-number">{statistics.cancelled}</p>
        </div>
        <div className="stat-card revenue">
          <h3>Total Revenue</h3>
          <p className="stat-number">${statistics.totalRevenue.toFixed(2)}</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="order-controls">
        <div className="filter-section">
          <label>Filter by Status:</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Orders</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <div className="search-section">
          <input
            type="text"
            placeholder="Search by Order ID, Customer Email or Name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="loading">Loading orders...</div>
      ) : (
        <div className="orders-list">
          <div className="order-header">
            <p>Order ID</p>
            <p>Customer</p>
            <p>Date</p>
            <p>Items</p>
            <p>Total</p>
            <p>Payment</p>
            <p>Status</p>
            <p>Actions</p>
          </div>

          <div className="orders-container">
            {filteredOrders.length === 0 ? (
              <div className="no-orders">No orders found</div>
            ) : (
              filteredOrders.map((order) => {
                const isExpanded = expandedOrder === order._id;
                return (
                  <div key={order._id} className="order-item-wrapper">
                    <div className="order-item">
                      <p className="order-id" title={order._id}>
                        {order._id.substring(0, 8)}...
                      </p>
                      <p className="customer-info">
                        {order.userId?.name || "N/A"}
                        <br />
                        <span className="customer-email">
                          {order.userId?.email || "N/A"}
                        </span>
                      </p>
                      <p className="order-date">
                        {formatDate(order.createdAt)}
                      </p>
                      <p className="order-items">{order.products.length}</p>
                      <p className="order-total">
                        ${order.totalAmount.toFixed(2)}
                      </p>
                      <p className="payment-method">{order.paymentMethod}</p>
                      <p>
                        <span
                          className={`status-badge ${getStatusBadgeClass(order.status)}`}
                        >
                          {order.status}
                        </span>
                      </p>
                      <div className="order-actions">
                        <button
                          className="btn-view"
                          onClick={() => toggleOrderDetails(order._id)}
                        >
                          {isExpanded ? "Hide" : "View"}
                        </button>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="order-details">
                        <div className="details-section">
                          <h3>Order Details</h3>
                          <div className="detail-row">
                            <strong>Order ID:</strong> {order._id}
                          </div>
                          <div className="detail-row">
                            <strong>Created:</strong>{" "}
                            {formatDate(order.createdAt)}
                          </div>
                          <div className="detail-row">
                            <strong>Last Updated:</strong>{" "}
                            {formatDate(order.updatedAt)}
                          </div>
                        </div>

                        <div className="details-section">
                          <h3>Customer Information</h3>
                          <div className="detail-row">
                            <strong>Name:</strong> {order.userId?.name || "N/A"}
                          </div>
                          <div className="detail-row">
                            <strong>Email:</strong>{" "}
                            {order.userId?.email || "N/A"}
                          </div>
                        </div>

                        <div className="details-section">
                          <h3>Shipping Address</h3>
                          {order.address ? (
                            <>
                              <div className="detail-row">
                                {order.address.street}, {order.address.city}
                              </div>
                              <div className="detail-row">
                                {order.address.state} - {order.address.zipCode}
                              </div>
                              <div className="detail-row">
                                {order.address.country}
                              </div>
                              {order.address.phone && (
                                <div className="detail-row">
                                  <strong>Phone:</strong> {order.address.phone}
                                </div>
                              )}
                            </>
                          ) : (
                            <div className="detail-row">
                              Address not available
                            </div>
                          )}
                        </div>

                        <div className="details-section products-section">
                          <h3>Products</h3>
                          <div className="products-table">
                            <div className="products-header">
                              <p>Image</p>
                              <p>Product</p>
                              <p>Size</p>
                              <p>Quantity</p>
                              <p>Price</p>
                              <p>Subtotal</p>
                            </div>
                            {order.products.map((item, index) => (
                              <div key={index} className="product-row">
                                <img
                                  src={item.productId?.image || ""}
                                  alt={item.productId?.name || "Product"}
                                  className="product-image"
                                />
                                <p>{item.productId?.name || "N/A"}</p>
                                <p>{item.size || "N/A"}</p>
                                <p>x{item.quantity}</p>
                                <p>${item.price.toFixed(2)}</p>
                                <p>
                                  ${(item.price * item.quantity).toFixed(2)}
                                </p>
                              </div>
                            ))}
                          </div>
                          <div className="order-total-section">
                            <strong>Total Amount:</strong> $
                            {order.totalAmount.toFixed(2)}
                          </div>
                        </div>

                        <div className="details-section status-update-section">
                          <h3>Update Order Status</h3>
                          <div className="status-buttons">
                            <button
                              className="status-btn pending"
                              onClick={() =>
                                updateOrderStatus(order._id, "pending")
                              }
                              disabled={order.status === "pending"}
                            >
                              Pending
                            </button>
                            <button
                              className="status-btn processing"
                              onClick={() =>
                                updateOrderStatus(order._id, "processing")
                              }
                              disabled={order.status === "processing"}
                            >
                              Processing
                            </button>
                            <button
                              className="status-btn shipped"
                              onClick={() =>
                                updateOrderStatus(order._id, "shipped")
                              }
                              disabled={order.status === "shipped"}
                            >
                              Shipped
                            </button>
                            <button
                              className="status-btn delivered"
                              onClick={() =>
                                updateOrderStatus(order._id, "delivered")
                              }
                              disabled={order.status === "delivered"}
                            >
                              Delivered
                            </button>
                            <button
                              className="status-btn cancelled"
                              onClick={() =>
                                updateOrderStatus(order._id, "cancelled")
                              }
                              disabled={order.status === "cancelled"}
                            >
                              Cancelled
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;
