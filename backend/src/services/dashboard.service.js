import prisma from "../config/prisma.js";

export const getUserCount = async () => {
  const count = await prisma.user.count();

  return {
    success: true,
    count,
  };
};

export const getProductCount = async () => {
  const count = await prisma.product.count();

  return {
    success: true,
    count,
  };
};

export const getDashboardStats = async () => {
  const [userCount, productCount] = await Promise.all([
    prisma.user.count(),
    prisma.product.count(),
  ]);

  return {
    success: true,
    users: userCount,
    products: productCount,
  };
};
