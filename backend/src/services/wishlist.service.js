import prisma from "../config/prisma.js";

export const addToWishlist = async (userId, productId) => {
  const product = await prisma.product.findUnique({
    where: {
      id: productId,
    },
  });

  if (!product) {
    throw new Error("Product not found");
  }

  let wishlist = await prisma.wishlist.findUnique({
    where: {
      userId,
    },
  });

  if (!wishlist) {
    wishlist = await prisma.wishlist.create({
      data: {
        userId,
      },
    });
  }

  const existingItem = await prisma.wishlistItem.findFirst({
    where: {
      wishlistId: wishlist.id,
      productId,
    },
  });

  if (!existingItem) {
    await prisma.wishlistItem.create({
      data: {
        wishlistId: wishlist.id,
        productId,
      },
    });
  }

  return true;
};

export const removeFromWishlist = async (userId, productId) => {
  const wishlist = await prisma.wishlist.findUnique({
    where: {
      userId,
    },
  });

  if (!wishlist) {
    throw new Error("Wishlist not found");
  }

  await prisma.wishlistItem.deleteMany({
    where: {
      wishlistId: wishlist.id,
      productId,
    },
  });

  return true;
};

export const getWishlistItems = async (userId) => {
  const wishlist = await prisma.wishlist.findUnique({
    where: {
      userId,
    },
    include: {
      items: {
        include: {
          product: {
            include: {
              images: true,
              variants: true,
            },
          },
        },
      },
    },
  });

  if (!wishlist) {
    throw new Error("Wishlist not found");
  }

  const formattedWishlist = {
    ...wishlist,
    items: wishlist.items.map((item) => ({
      ...item,
      product: {
        ...item.product,
        image: item.product.images?.[0]?.url || null,
        sizeStock:
          item.product.variants?.reduce((acc, variant) => {
            acc[variant.size] = variant.stock;
            return acc;
          }, {}) || {},
      },
    })),
  };

  return formattedWishlist;
};
