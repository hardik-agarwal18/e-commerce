import prisma from "../config/prisma.js";

const generateOrderNumber = () => {
  return `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
};

export const createOrder = async (userId, addressId, paymentMethod = "COD") => {
  const cart = await prisma.cart.findUnique({
    where: {
      userId,
    },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!cart || cart.items.length === 0) {
    throw new Error("Cart is empty");
  }

  const address = await prisma.address.findUnique({
    where: {
      id: addressId,
    },
  });

  if (!address) {
    throw new Error("Address not found");
  }

  let totalAmount = 0;

  const orderItems = [];

  for (const item of cart.items) {
    const product = item.product;

    if (!product) {
      throw new Error("Product not found");
    }

    if (!product.available) {
      throw new Error(`${product.name} is not available`);
    }

    const itemPrice = Number(product.newPrice);

    totalAmount += itemPrice * item.quantity;

    orderItems.push({
      productId: product.id,
      quantity: item.quantity,
      price: itemPrice,
      size: item.size,
    });
  }

  const order = await prisma.$transaction(async (tx) => {
    const createdOrder = await tx.order.create({
      data: {
        orderNumber: generateOrderNumber(),

        userId,

        addressId,

        paymentMethod,

        totalAmount,

        items: {
          create: orderItems,
        },
      },

      include: {
        items: true,
      },
    });

    await tx.cartItem.deleteMany({
      where: {
        cartId: cart.id,
      },
    });

    await tx.cart.update({
      where: {
        id: cart.id,
      },
      data: {
        totalAmount: 0,
      },
    });

    return createdOrder;
  });

  return order;
};

export const getUserOrders = async (userId) => {
  return prisma.order.findMany({
    where: {
      userId,
    },

    include: {
      address: true,

      items: {
        include: {
          product: {
            include: {
              images: true,
            },
          },
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getOrderById = async (orderId, userId) => {
  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      userId,
    },

    include: {
      address: true,

      items: {
        include: {
          product: {
            include: {
              images: true,
            },
          },
        },
      },
    },
  });

  if (!order) {
    throw new Error("Order not found");
  }

  return order;
};

export const cancelOrder = async (orderId, userId) => {
  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      userId,
    },
  });

  if (!order) {
    throw new Error("Order not found");
  }

  if (order.status !== "PENDING") {
    throw new Error("Cannot cancel order. Order is already being processed.");
  }

  return prisma.order.update({
    where: {
      id: orderId,
    },

    data: {
      status: "CANCELLED",
    },
  });
};

export const updateOrderStatus = async (orderId, status) => {
  const order = await prisma.order.findUnique({
    where: {
      id: orderId,
    },
  });

  if (!order) {
    throw new Error("Order not found");
  }

  return prisma.order.update({
    where: {
      id: orderId,
    },

    data: {
      status,
    },
  });
};

export const getAllOrders = async () => {
  return prisma.order.findMany({
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },

      address: true,

      items: {
        include: {
          product: {
            include: {
              images: true,
            },
          },
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  });
};
