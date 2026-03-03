import React, { useState, useEffect } from "react";
import { axiosInstance } from "../lib/axios";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import "./CSS/Orders.css";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axiosInstance.get("/api/orders/my-orders", {
        headers: {
          "auth-token": localStorage.getItem("auth-token"),
        },
      });

      if (response.data.success) {
        setOrders(response.data.orders);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) {
      return;
    }

    try {
      const response = await axiosInstance.put(
        `/api/orders/${orderId}/cancel`,
        {},
        {
          headers: {
            "auth-token": localStorage.getItem("auth-token"),
          },
        },
      );

      if (response.data.success) {
        toast.success("Order cancelled successfully");
        fetchOrders();
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
      toast.error(error.response?.data?.message || "Failed to cancel order");
    }
  };

  const getStatusBadgeClass = (status) => {
    const statusClasses = {
      pending: "status-pending",
      processing: "status-processing",
      shipped: "status-shipped",
      delivered: "status-delivered",
      cancelled: "status-cancelled",
    };
    return statusClasses[status] || "status-default";
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="orders-page">
        <div className="orders-loading">Loading your orders...</div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="orders-page">
        <div className="orders-empty">
          <h2>No Orders Yet</h2>
          <p>You haven't placed any orders yet.</p>
          <Link to="/">
            <button className="continue-shopping-btn">Start Shopping</button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="orders-header">
        <h1>My Orders</h1>
        <p className="orders-count">
          {orders.length} {orders.length === 1 ? "order" : "orders"}
        </p>
      </div>

      <div className="orders-list">
        {orders.map((order) => (
          <div key={order._id} className="order-card">
            <div className="order-header">
              <div className="order-info">
                <h3>Order #{order._id.slice(-8).toUpperCase()}</h3>
                <p className="order-date">{formatDate(order.createdAt)}</p>
              </div>
              <div className="order-status-section">
                <span
                  className={`order-status ${getStatusBadgeClass(order.status)}`}
                >
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
            </div>

            <div className="order-products">
              {order.products.map((item, index) => (
                <div key={index} className="order-product-item">
                  <div className="product-image">
                    <img
                      src={item.productId?.image || "/placeholder.png"}
                      alt={item.productId?.name || "Product"}
                    />
                  </div>
                  <div className="product-details">
                    <h4>{item.productId?.name || "Product"}</h4>
                    {item.size && (
                      <p className="product-size">Size: {item.size}</p>
                    )}
                    <p className="product-quantity">
                      Quantity: {item.quantity}
                    </p>
                    <p className="product-price">${item.price}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="order-footer">
              <div className="order-address">
                <h4>Delivery Address</h4>
                {order.address && (
                  <p>
                    {order.address.fullName}, {order.address.street},{" "}
                    {order.address.city}, {order.address.state} -{" "}
                    {order.address.postalCode}
                  </p>
                )}
              </div>

              <div className="order-total-section">
                <div className="order-total">
                  <span>Total Amount:</span>
                  <span className="total-amount">
                    ${order.totalAmount.toFixed(2)}
                  </span>
                </div>
                <div className="order-actions">
                  <button
                    className="view-details-btn"
                    onClick={() =>
                      setSelectedOrder(
                        selectedOrder === order._id ? null : order._id,
                      )
                    }
                  >
                    {selectedOrder === order._id
                      ? "Hide Details"
                      : "View Details"}
                  </button>
                  {order.status === "pending" && (
                    <button
                      className="cancel-order-btn"
                      onClick={() => handleCancelOrder(order._id)}
                    >
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>
            </div>

            {selectedOrder === order._id && (
              <div className="order-details-expanded">
                <h4>Order Details</h4>
                <div className="detail-row">
                  <span>Order ID:</span>
                  <span>{order._id}</span>
                </div>
                <div className="detail-row">
                  <span>Payment Method:</span>
                  <span>{order.paymentMethod || "COD"}</span>
                </div>
                <div className="detail-row">
                  <span>Order Date:</span>
                  <span>{new Date(order.createdAt).toLocaleString()}</span>
                </div>
                {order.updatedAt !== order.createdAt && (
                  <div className="detail-row">
                    <span>Last Updated:</span>
                    <span>{new Date(order.updatedAt).toLocaleString()}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
