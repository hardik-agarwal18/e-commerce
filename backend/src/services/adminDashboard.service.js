import prisma from "../config/prisma.js";

export const getDashboardStats = async () => {
  const today = new Date();

  const startOfToday = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );

  const startOfWeek = new Date();
  startOfWeek.setDate(today.getDate() - 7);

  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const [
    users,
    products,
    orders,
    reviews,
    promoCodes,

    pendingOrders,
    deliveredOrders,
    cancelledOrders,

    todayUsers,
    weeklyUsers,
    monthlyUsers,

    inStockProducts,
    outOfStockProducts,
    lowStockProducts,
  ] = await Promise.all([
    prisma.user.count(),

    prisma.product.count(),

    prisma.order.count(),

    prisma.review.count(),

    prisma.promoCode.count(),

    prisma.order.count({
      where: {
        status: "PENDING",
      },
    }),

    prisma.order.count({
      where: {
        status: "DELIVERED",
      },
    }),

    prisma.order.count({
      where: {
        status: "CANCELLED",
      },
    }),

    prisma.user.count({
      where: {
        createdAt: {
          gte: startOfToday,
        },
      },
    }),

    prisma.user.count({
      where: {
        createdAt: {
          gte: startOfWeek,
        },
      },
    }),

    prisma.user.count({
      where: {
        createdAt: {
          gte: startOfMonth,
        },
      },
    }),

    prisma.product.count({
      where: {
        stock: {
          gt: 0,
        },
      },
    }),

    prisma.product.count({
      where: {
        stock: 0,
      },
    }),

    prisma.product.count({
      where: {
        stock: {
          lt: 10,
        },
      },
    }),
  ]);

  const revenueResult = await prisma.order.aggregate({
    _sum: {
      totalAmount: true,
    },
  });

  const todayRevenue = await prisma.order.aggregate({
    where: {
      createdAt: {
        gte: startOfToday,
      },
    },
    _sum: {
      totalAmount: true,
    },
  });

  const monthlyRevenue = await prisma.order.aggregate({
    where: {
      createdAt: {
        gte: startOfMonth,
      },
    },
    _sum: {
      totalAmount: true,
    },
  });

  const weeklyRevenue = await prisma.order.aggregate({
    where: {
      createdAt: {
        gte: startOfWeek,
      },
    },
    _sum: {
      totalAmount: true,
    },
  });

  const recentOrders = await prisma.order.findMany({
    take: 10,

    orderBy: {
      createdAt: "desc",
    },

    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  const topProducts = await prisma.orderItem.groupBy({
    by: ["productId"],

    _sum: {
      quantity: true,
    },

    orderBy: {
      _sum: {
        quantity: "desc",
      },
    },

    take: 5,
  });

  const productIds = topProducts.map((p) => p.productId);

  const productsData = await prisma.product.findMany({
    where: {
      id: {
        in: productIds,
      },
    },
  });

  const topSellingProducts = topProducts.map((item) => ({
    ...item,
    product: productsData.find((p) => p.id === item.productId),
  }));

  return {
    overview: {
      users,
      products,
      orders,
      reviews,
      promoCodes,

      revenue: Number(revenueResult._sum.totalAmount) || 0,
    },

    orders: {
      pendingOrders,
      deliveredOrders,
      cancelledOrders,
    },

    usersStats: {
      todayUsers,
      weeklyUsers,
      monthlyUsers,
    },

    productsStats: {
      inStockProducts,
      outOfStockProducts,
      lowStockProducts,
    },

    revenue: {
      today: Number(todayRevenue._sum.totalAmount) || 0,

      weekly: Number(weeklyRevenue._sum.totalAmount) || 0,

      monthly: Number(monthlyRevenue._sum.totalAmount) || 0,
    },

    averageOrderValue:
      orders > 0 ? Number(revenueResult._sum.totalAmount) / orders : 0,

    topSellingProducts,

    recentOrders,
  };
};
