import prisma from "../config/prisma.js";

const serializeProduct = (product) => ({
  ...product,
  image: product.images?.[0]?.url || null,
  sizeStock:
    product.variants?.reduce((acc, variant) => {
      acc[variant.size] = variant.stock;
      return acc;
    }, {}) || {},
});

export const createProduct = async (productData) => {
  const { name, image, category, new_price, old_price, stock, sizeStock } =
    productData;

  let totalStock = stock || 0;

  if (sizeStock) {
    totalStock = Object.values(sizeStock).reduce(
      (sum, qty) => sum + Number(qty),
      0,
    );
  }

  const product = await prisma.product.create({
    data: {
      name,
      category,
      newPrice: new_price,
      oldPrice: old_price,
      stock: totalStock,
      available: totalStock > 0,

      images: image
        ? {
            create: [
              {
                url: image,
              },
            ],
          }
        : undefined,

      variants: sizeStock
        ? {
            create: Object.entries(sizeStock).map(([size, qty]) => ({
              size,
              stock: qty,
            })),
          }
        : undefined,
    },
  });

  return product;
};

export const removeProduct = async (id) => {
  const existingProduct = await prisma.product.findUnique({
    where: { id },
  });

  if (!existingProduct) {
    return null;
  }

  await prisma.product.delete({
    where: { id },
  });

  return existingProduct;
};

export const fetchAllProducts = async () => {
  const products = await prisma.product.findMany({
    include: {
      images: true,
      variants: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return products.map(serializeProduct);
};

export const fetchNewCollection = async () => {
  const products = await prisma.product.findMany({
    include: {
      images: true,
      variants: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return products.slice(1).slice(-8).map(serializeProduct);
};

export const fetchPopularWomenProducts = async () => {
  const products = await prisma.product.findMany({
    where: {
      category: "women",
    },
    include: {
      images: true,
      variants: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return products.slice(1).slice(-4).map(serializeProduct);
};

export const updateProductById = async (data) => {
  const { id, name, image, category, new_price, old_price, stock, sizeStock } =
    data;

  const existingProduct = await prisma.product.findUnique({
    where: { id },
    include: {
      images: true,
      variants: true,
    },
  });

  if (!existingProduct) {
    return null;
  }

  let totalStock = stock ?? existingProduct.stock;

  if (sizeStock) {
    totalStock = Object.values(sizeStock).reduce(
      (sum, qty) => sum + Number(qty),
      0,
    );
  }

  const updatedProduct = await prisma.$transaction(async (tx) => {
    if (image !== undefined) {
      await tx.productImage.deleteMany({
        where: {
          productId: id,
        },
      });

      if (image) {
        await tx.productImage.create({
          data: {
            productId: id,
            url: image,
          },
        });
      }
    }

    if (sizeStock !== undefined) {
      await tx.productVariant.deleteMany({
        where: {
          productId: id,
        },
      });

      await tx.productVariant.createMany({
        data: Object.entries(sizeStock).map(([size, qty]) => ({
          productId: id,
          size,
          stock: qty,
        })),
      });
    }

    return tx.product.update({
      where: {
        id,
      },
      data: {
        ...(name !== undefined && { name }),
        ...(category !== undefined && { category }),
        ...(new_price !== undefined && { newPrice: new_price }),
        ...(old_price !== undefined && { oldPrice: old_price }),

        stock: totalStock,
        available: totalStock > 0,
      },
      include: {
        images: true,
        variants: true,
      },
    });
  });

  return serializeProduct(updatedProduct);
};

export const fetchProductById = async (id) => {
  const product = await prisma.product.findUnique({
    where: {
      id,
    },
    include: {
      images: true,
      variants: true,
    },
  });

  if (!product) {
    return null;
  }

  return serializeProduct(product);
};
