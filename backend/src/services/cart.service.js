import prisma from "../config/prisma.js";

const calculateCartTotal = (items) => {
  return items.reduce(
    (sum, item) => sum + Number(item.product.newPrice) * item.quantity,
    0,
  );
};

export const addToCart = async (userId, productId, size, quantity = 1) => {
  const product = await prisma.product.findUnique({
    where: {
      id: productId,
    },
    include: {
      variants: true,
    },
  });

  if (!product) {
    throw new Error("Product not found");
  }

  if (!product.available) {
    throw new Error("Product is not available");
  }

  let availableStock = product.stock;

  if (size) {
    const variant = product.variants.find((v) => v.size === size);

    availableStock = variant?.stock || 0;

    if (availableStock <= 0) {
      throw new Error(`Size ${size} is out of stock`);
    }
  }

  if (quantity > availableStock) {
    throw new Error(`Only ${availableStock} items available`);
  }

  const cart = await prisma.cart.findUnique({
    where: {
      userId,
    },
  });

  const existingItem = await prisma.cartItem.findFirst({
    where: {
      cartId: cart.id,
      productId,
      size: size || null,
    },
  });

  if (existingItem) {
    await prisma.cartItem.update({
      where: {
        id: existingItem.id,
      },
      data: {
        quantity: {
          increment: quantity,
        },
      },
    });
  } else {
    await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        quantity,
        size: size || null,
      },
    });
  }

  return getCart(userId);
};

export const removeFromCart = async (userId, productId, size, quantity = 1) => {
  const cart = await prisma.cart.findUnique({
    where: {
      userId,
    },
    include: {
      items: true,
    },
  });

  if (!cart) {
    throw new Error("Cart not found");
  }

  const item = cart.items.find(
    (i) => i.productId === productId && i.size === (size || null),
  );

  if (!item) {
    throw new Error("Item not found in cart");
  }

  if (item.quantity <= quantity) {
    await prisma.cartItem.delete({
      where: {
        id: item.id,
      },
    });
  } else {
    await prisma.cartItem.update({
      where: {
        id: item.id,
      },
      data: {
        quantity: {
          decrement: quantity,
        },
      },
    });
  }

  return getCart(userId);
};

export const updateCartItemQuantity = async (
  userId,
  productId,
  size,
  quantity,
) => {
  if (quantity < 0) {
    throw new Error("Quantity cannot be negative");
  }

  const cart = await prisma.cart.findUnique({
    where: {
      userId,
    },
    include: {
      items: true,
    },
  });

  const item = cart.items.find(
    (i) => i.productId === productId && i.size === (size || null),
  );

  if (!item) {
    throw new Error("Item not found");
  }

  if (quantity === 0) {
    await prisma.cartItem.delete({
      where: {
        id: item.id,
      },
    });
  } else {
    await prisma.cartItem.update({
      where: {
        id: item.id,
      },
      data: {
        quantity,
      },
    });
  }

  return getCart(userId);
};

export const getCart = async (userId) => {
  const cart = await prisma.cart.findUnique({
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

  const totalAmount = calculateCartTotal(cart.items);

  await prisma.cart.update({
    where: {
      id: cart.id,
    },
    data: {
      totalAmount,
    },
  });

  return {
    ...cart,
    totalAmount,
  };
};

export const clearCart = async (userId) => {
  const cart = await prisma.cart.findUnique({
    where: {
      userId,
    },
  });

  await prisma.cartItem.deleteMany({
    where: {
      cartId: cart.id,
    },
  });

  await prisma.cart.update({
    where: {
      id: cart.id,
    },
    data: {
      totalAmount: 0,
    },
  });

  return true;
};
