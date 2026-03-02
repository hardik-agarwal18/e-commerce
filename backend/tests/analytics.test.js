import request from "supertest";
import app from "../src/app.js";
import mongoose from "mongoose";
import Users from "../src/models/UserModel.js";
import Product from "../src/models/ProductModel.js";

describe("Analytics API", () => {
  let adminToken;

  const adminUser = {
    email: process.env.ADMIN_EMAIL || "admin@example.com",
    password: process.env.ADMIN_PASSWORD || "admin123",
  };

  beforeAll(async () => {
    // Login as admin
    const loginRes = await request(app)
      .post("/api/admin/login")
      .send(adminUser);
    adminToken = loginRes.body.token;
  });

  beforeEach(async () => {
    // Clear collections before each test
    await Users.deleteMany({});
    await Product.deleteMany({});
  });

  afterAll(async () => {
    await Users.deleteMany({});
    await Product.deleteMany({});
    await mongoose.connection.close();
  });

  describe("GET /api/analytics/user-count", () => {
    it("should return 0 when there are no users", async () => {
      const res = await request(app)
        .get("/api/analytics/user-count")
        .set("auth-token", adminToken);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.count).toBe(0);
    });

    it("should return correct user count", async () => {
      // Create test users
      const users = [
        {
          name: "User 1",
          email: "analytics-user1@test.com",
          password: "123456",
        },
        {
          name: "User 2",
          email: "analytics-user2@test.com",
          password: "123456",
        },
        {
          name: "User 3",
          email: "analytics-user3@test.com",
          password: "123456",
        },
      ];

      for (const user of users) {
        await request(app).post("/api/auth/signup").send(user);
      }

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
      const res = await request(app)
        .get("/api/analytics/product-count")
        .set("auth-token", adminToken);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.count).toBe(0);
    });

    it("should return correct product count", async () => {
      // Create test products
      const products = [
        {
          id: 1,
          name: "Product 1",
          image: "http://example.com/1.jpg",
          category: "men",
          new_price: 100,
          old_price: 150,
          stock: 10,
          available: true,
        },
        {
          id: 2,
          name: "Product 2",
          image: "http://example.com/2.jpg",
          category: "women",
          new_price: 200,
          old_price: 250,
          stock: 5,
          available: true,
        },
        {
          id: 3,
          name: "Product 3",
          image: "http://example.com/3.jpg",
          category: "kids",
          new_price: 50,
          old_price: 75,
          stock: 20,
          available: true,
        },
      ];

      for (const product of products) {
        await Product.create(product);
      }

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
