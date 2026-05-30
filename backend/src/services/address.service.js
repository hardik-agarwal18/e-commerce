import prisma from "../config/prisma.js";

export const createAddress = async (userId, addressData) => {
  const {
    fullName,
    phone,
    street,
    city,
    state,
    postalCode,
    country,
    isDefault,
  } = addressData;

  if (!fullName || !phone || !street || !city || !state || !postalCode) {
    throw new Error("All required fields must be provided");
  }

  return prisma.$transaction(async (tx) => {
    if (isDefault) {
      await tx.address.updateMany({
        where: {
          userId,
          isDefault: true,
        },
        data: {
          isDefault: false,
        },
      });
    }

    const address = await tx.address.create({
      data: {
        userId,
        fullName,
        phone,
        street,
        city,
        state,
        postalCode,
        country: country || "India",
        isDefault: isDefault || false,
      },
    });

    return address;
  });
};

export const getUserAddresses = async (userId) => {
  return prisma.address.findMany({
    where: {
      userId,
    },
    orderBy: [
      {
        isDefault: "desc",
      },
      {
        createdAt: "desc",
      },
    ],
  });
};

export const deleteAddress = async (addressId, userId) => {
  const address = await prisma.address.findUnique({
    where: {
      id: addressId,
    },
  });

  if (!address) {
    throw new Error("Address not found");
  }

  if (address.userId !== userId) {
    throw new Error("Unauthorized");
  }

  await prisma.address.delete({
    where: {
      id: addressId,
    },
  });

  return true;
};
