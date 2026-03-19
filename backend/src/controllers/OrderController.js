import Order from "../models/OrderModel.js";
import Cart from "../models/CartModel.js";
import Product from "../models/ProductModel.js";
import Users from "../models/UserModel.js";

// Create a new order
export const createOrder = async (req, res) => {
  const { addressId, paymentMethod = "COD" } = req.body;
  const userId = req.user.id;

  try {
    // Get user's cart
    const cart = await Cart.findOne({ userId }).populate("products.productId");

    if (!cart || cart.products.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    // Calculate total amount and prepare order products
    let totalAmount = 0;
    const orderProducts = [];

    for (const item of cart.products) {
      const product = item.productId;

      // Check if product exists and has stock
      if (!product) {
        return res.status(400).json({
          success: false,
          message: "Product not found in cart",
        });
      }

      const itemPrice = product.new_price || product.price;
      const itemTotal = itemPrice * item.quantity;
      totalAmount += itemTotal;

      orderProducts.push({
        productId: product._id,
        quantity: item.quantity,
        price: itemPrice,
        size: item.size || null,
      });
    }

    // Create the order
    const order = new Order({
      userId,
      products: orderProducts,
      totalAmount,
      address: addressId,
      status: "pending",
      paymentMethod,
    });

    await order.save();

    // Clear the user's cart after successful order in both cart stores
    await Promise.all([
      Cart.findOneAndDelete({ userId }),
      Users.findByIdAndUpdate(userId, { cartData: {} }),
    ]);

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: {
        orderId: order._id,
        totalAmount,
        status: order.status,
      },
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create order",
    });
  }
};

// Get user's orders
export const getUserOrders = async (req, res) => {
  const userId = req.user.id;

  try {
    const orders = await Order.find({ userId })
      .populate("products.productId")
      .populate("address")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
    });
  }
};

// Get specific order by ID
export const getOrderById = async (req, res) => {
  const { orderId } = req.params;
  const userId = req.user.id;

  try {
    const order = await Order.findOne({ _id: orderId, userId })
      .populate("products.productId")
      .populate("address");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch order",
    });
  }
};

// Cancel an order (only if pending)
export const cancelOrder = async (req, res) => {
  const { orderId } = req.params;
  const userId = req.user.id;

  try {
    const order = await Order.findOne({ _id: orderId, userId });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Cannot cancel order. Order is already being processed.",
      });
    }

    order.status = "cancelled";
    await order.save();

    res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      order,
    });
  } catch (error) {
    console.error("Error cancelling order:", error);
    res.status(500).json({
      success: false,
      message: "Failed to cancel order",
    });
  }
};

// Admin: Update order status
export const updateOrderStatus = async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  const validStatuses = [
    "pending",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
  ];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: "Invalid status",
    });
  }

  try {
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.status = status;
    await order.save();

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update order status",
    });
  }
};

// Admin: Get all orders
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "name email")
      .populate("products.productId")
      .populate("address")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Error fetching all orders:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
    });
  }
};
