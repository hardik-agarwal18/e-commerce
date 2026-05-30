import bcrypt from "bcrypt";
import prisma from "../config/prisma.js";

export const createUser = async ({ name, email, password }) => {
  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    throw new Error("User Exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      cart: {
        create: {
          totalAmount: 0,
        },
      },
      wishlist: {
        create: {},
      },
    },
  });

  return user;
};

export const loginUser = async ({ email, password }) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new Error("User not exists");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Wrong Password");
  }

  return user;
};
