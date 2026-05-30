import dotenv from "dotenv";
import prisma from "../src/config/prisma.js";

dotenv.config();

beforeAll(async () => {
  await prisma.$connect();
});

beforeEach(async () => {
  await prisma.promoCodeUsage.deleteMany();
  await prisma.promoCode.deleteMany();

  await prisma.review.deleteMany();

  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();

  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();

  await prisma.wishlistItem.deleteMany();
  await prisma.wishlist.deleteMany();

  await prisma.address.deleteMany();

  await prisma.productVariant.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();

  await prisma.user.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});
