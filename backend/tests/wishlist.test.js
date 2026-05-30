import request from "supertest";
import app from "../src/app.js";
import prisma from "../src/config/prisma.js";
import jwt from "jsonwebtoken";

describe("Wishlist API", () => {
  let authToken;
  let userId;
  let testProduct;

  const testUser = {
    name: "wishlistuser",
    email: "[wishlist-test@mail.com](mailto:wishlist-test@mail.com)",
    password: "123456",
  };

  beforeAll(async () => {
    await prisma.wishlistItem.deleteMany();
    await prisma.wishlist.deleteMany();

    await prisma.productVariant.deleteMany();
    await prisma.productImage.deleteMany();
    await prisma.product.deleteMany();

    await prisma.cartItem.deleteMany();
    await prisma.cart.deleteMany();

    await prisma.user.deleteMany({
      where: {
        email: testUser.email,
      },
    });

    const signupRes = await request(app)
      .post("/api/auth/signup")
      .send(testUser);

    authToken = signupRes.body.token;

    const decoded = jwt.verify(authToken, process.env.JWT_SECRET);

    userId = decoded.user.id;

    testProduct = await prisma.product.create({
      data: {
        name: "Test Product",
        category: "men",
        newPrice: 100,
        oldPrice: 150,
        stock: 10,
        available: true,

        images: {
          create: [
            {
              url: "https://example.com/test.jpg",
            },
          ],
        },
      },
    });
  });

  afterAll(async () => {
    await prisma.wishlistItem.deleteMany();
    await prisma.wishlist.deleteMany();

    await prisma.productVariant.deleteMany();
    await prisma.productImage.deleteMany();
    await prisma.product.deleteMany();

    await prisma.cartItem.deleteMany();
    await prisma.cart.deleteMany();

    await prisma.user.deleteMany({
      where: {
        email: testUser.email,
      },
    });

    await prisma.$disconnect();
  });

  beforeEach(async () => {
    await prisma.wishlistItem.deleteMany();

    await prisma.wishlist.deleteMany({
      where: {
        userId,
      },
    });

    await prisma.wishlist.create({
      data: {
        userId,
      },
    });
  });

  describe("POST /api/user/add-to-wishlist", () => {
    it("should add product to wishlist successfully", async () => {
      const res = await request(app)
        .post("/api/user/add-to-wishlist")
        .set("auth-token", authToken)
        .send({
          productId: testProduct.id,
        });

      expect(res.statusCode).toBe(200);

      expect(res.body.message).toBe("Product added to wishlist");

      const wishlist = await prisma.wishlist.findUnique({
        where: {
          userId,
        },
        include: {
          items: true,
        },
      });

      expect(wishlist).toBeDefined();

      expect(wishlist.items).toHaveLength(1);

      expect(wishlist.items[0].productId).toBe(testProduct.id);
    });

    it("should not add duplicate product to wishlist", async () => {
      await request(app)
        .post("/api/user/add-to-wishlist")
        .set("auth-token", authToken)
        .send({
          productId: testProduct.id,
        });

      await request(app)
        .post("/api/user/add-to-wishlist")
        .set("auth-token", authToken)
        .send({
          productId: testProduct.id,
        });

      const wishlist = await prisma.wishlist.findUnique({
        where: {
          userId,
        },
        include: {
          items: true,
        },
      });

      expect(wishlist.items).toHaveLength(1);
    });

    it("should require authentication", async () => {
      const res = await request(app).post("/api/user/add-to-wishlist").send({
        productId: testProduct.id,
      });

      expect(res.statusCode).toBe(401);
    });
  });

  describe("POST /api/user/remove-from-wishlist", () => {
    beforeEach(async () => {
      await request(app)
        .post("/api/user/add-to-wishlist")
        .set("auth-token", authToken)
        .send({
          productId: testProduct.id,
        });
    });

    it("should remove product from wishlist successfully", async () => {
      const res = await request(app)
        .post("/api/user/remove-from-wishlist")
        .set("auth-token", authToken)
        .send({
          productId: testProduct.id,
        });

      expect(res.statusCode).toBe(200);

      expect(res.body.message).toBe("Product removed from wishlist");

      const wishlist = await prisma.wishlist.findUnique({
        where: {
          userId,
        },
        include: {
          items: true,
        },
      });

      expect(wishlist.items).toHaveLength(0);
    });

    it("should return error if wishlist doesn't exist", async () => {
      await prisma.wishlistItem.deleteMany();

      await prisma.wishlist.deleteMany({
        where: {
          userId,
        },
      });

      const res = await request(app)
        .post("/api/user/remove-from-wishlist")
        .set("auth-token", authToken)
        .send({
          productId: testProduct.id,
        });

      expect(res.statusCode).toBe(404);

      expect(res.body.message).toBe("Wishlist not found");
    });

    it("should remove only specified product", async () => {
      const anotherProduct = await prisma.product.create({
        data: {
          name: "Another Product",
          category: "women",
          newPrice: 200,
          oldPrice: 250,
          stock: 5,
          available: true,

          images: {
            create: [
              {
                url: "https://example.com/another.jpg",
              },
            ],
          },
        },
      });

      await request(app)
        .post("/api/user/add-to-wishlist")
        .set("auth-token", authToken)
        .send({
          productId: anotherProduct.id,
        });

      await request(app)
        .post("/api/user/remove-from-wishlist")
        .set("auth-token", authToken)
        .send({
          productId: testProduct.id,
        });

      const wishlist = await prisma.wishlist.findUnique({
        where: {
          userId,
        },
        include: {
          items: true,
        },
      });

      expect(wishlist.items).toHaveLength(1);

      expect(wishlist.items[0].productId).toBe(anotherProduct.id);
    });

    it("should require authentication", async () => {
      const res = await request(app)
        .post("/api/user/remove-from-wishlist")
        .send({
          productId: testProduct.id,
        });

      expect(res.statusCode).toBe(401);
    });
  });

  describe("GET /api/user/get-wishlist-items", () => {
    beforeEach(async () => {
      await request(app)
        .post("/api/user/add-to-wishlist")
        .set("auth-token", authToken)
        .send({
          productId: testProduct.id,
        });
    });

    it("should get wishlist items", async () => {
      const res = await request(app)
        .get("/api/user/get-wishlist-items")
        .set("auth-token", authToken);

      expect(res.statusCode).toBe(200);

      expect(res.body.wishlist).toBeDefined();

      expect(res.body.wishlist.items.length).toBe(1);
    });

    it("should return error if wishlist doesn't exist", async () => {
      await prisma.wishlistItem.deleteMany();

      await prisma.wishlist.deleteMany({
        where: {
          userId,
        },
      });

      const res = await request(app)
        .get("/api/user/get-wishlist-items")
        .set("auth-token", authToken);

      expect(res.statusCode).toBe(404);

      expect(res.body.message).toBe("Wishlist not found");
    });

    it("should require authentication", async () => {
      const res = await request(app).get("/api/user/get-wishlist-items");

      expect(res.statusCode).toBe(401);
    });
  });
});
