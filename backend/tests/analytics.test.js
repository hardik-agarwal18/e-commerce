import request from "supertest";
import app from "../src/app.js";
import prisma from "../src/config/prisma.js";

describe("Analytics API", () => {
  let adminToken;

  const adminUser = {
    email: "[admin@example.com](mailto:admin@example.com)",
    password: "admin123",
  };

  beforeAll(async () => {
    process.env.ADMIN_EMAIL = adminUser.email;

    process.env.ADMIN_PASSWORD = adminUser.password;

    const loginRes = await request(app)
      .post("/api/admin/login")
      .send(adminUser);

    adminToken = loginRes.body.token;
  });

  beforeEach(async () => {
    await prisma.productVariant.deleteMany();

    await prisma.productImage.deleteMany();

    await prisma.product.deleteMany();

    await prisma.cartItem.deleteMany();

    await prisma.cart.deleteMany();

    await prisma.wishlistItem.deleteMany();

    await prisma.wishlist.deleteMany();

    await prisma.user.deleteMany({
      where: {
        email: {
          contains: "analytics-user",
        },
      },
    });
  });

  afterAll(async () => {
    await prisma.productVariant.deleteMany();

    await prisma.productImage.deleteMany();

    await prisma.product.deleteMany();

    await prisma.cartItem.deleteMany();

    await prisma.cart.deleteMany();

    await prisma.wishlistItem.deleteMany();

    await prisma.wishlist.deleteMany();

    await prisma.user.deleteMany({
      where: {
        email: {
          contains: "analytics-user",
        },
      },
    });

    await prisma.$disconnect();
  });

  describe("GET /api/analytics/user-count", () => {
    it("should return 0 when there are no users", async () => {
      await prisma.user.deleteMany({
        where: {
          email: {
            contains: "analytics-user",
          },
        },
      });

      const res = await request(app)
        .get("/api/analytics/user-count")
        .set("auth-token", adminToken);

      expect(res.statusCode).toBe(200);

      expect(res.body.success).toBe(true);

      expect(res.body.count).toBe(0);
    });

    it("should return correct user count", async () => {
      await prisma.user.create({
        data: {
          name: "User 1",
          email: "analytics-user1@test.com",
          password: "hashedpassword",

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

      await prisma.user.create({
        data: {
          name: "User 2",
          email: "analytics-user2@test.com",
          password: "hashedpassword",

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

      await prisma.user.create({
        data: {
          name: "User 3",
          email: "analytics-user3@test.com",
          password: "hashedpassword",

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

      const res = await request(app)
        .get("/api/analytics/user-count")
        .set("auth-token", adminToken);

      expect(res.statusCode).toBe(200);

      expect(res.body.success).toBe(true);

      expect(res.body.count).toBe(3);
    });

    it("should require admin authentication", async () => {
      const res = await request(app).get("/api/analytics/user-count");

      expect(res.statusCode).toBe(401);
    });
  });

  describe("GET /api/analytics/product-count", () => {
    it("should return 0 when there are no products", async () => {
      await prisma.product.deleteMany();

      const res = await request(app)
        .get("/api/analytics/product-count")
        .set("auth-token", adminToken);

      expect(res.statusCode).toBe(200);

      expect(res.body.success).toBe(true);

      expect(res.body.count).toBe(0);
    });

    it("should return correct product count", async () => {
      await prisma.product.create({
        data: {
          name: "Product 1",
          category: "men",
          newPrice: 100,
          oldPrice: 150,
          stock: 10,
          available: true,

          images: {
            create: [
              {
                url: "https://test.com/1.jpg",
                altText: "Product 1",
              },
            ],
          },
        },
      });

      await prisma.product.create({
        data: {
          name: "Product 2",
          category: "women",
          newPrice: 200,
          oldPrice: 250,
          stock: 5,
          available: true,

          images: {
            create: [
              {
                url: "https://test.com/2.jpg",
                altText: "Product 2",
              },
            ],
          },
        },
      });

      await prisma.product.create({
        data: {
          name: "Product 3",
          category: "kids",
          newPrice: 50,
          oldPrice: 75,
          stock: 20,
          available: true,

          images: {
            create: [
              {
                url: "https://test.com/3.jpg",
                altText: "Product 3",
              },
            ],
          },
        },
      });

      const res = await request(app)
        .get("/api/analytics/product-count")
        .set("auth-token", adminToken);

      expect(res.statusCode).toBe(200);

      expect(res.body.success).toBe(true);

      expect(res.body.count).toBe(3);
    });

    it("should require admin authentication", async () => {
      const res = await request(app).get("/api/analytics/product-count");

      expect(res.statusCode).toBe(401);
    });
  });
});
