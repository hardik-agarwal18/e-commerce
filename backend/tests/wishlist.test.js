import request from "supertest";
import app from "../src/app.js";
import mongoose from "mongoose";
import Users from "../src/models/UserModel.js";
import Product from "../src/models/ProductModel.js";
import WishList from "../src/models/WishListModel.js";

describe("Wishlist API", () => {
  let authToken;
  let userId;
  let testProduct;

  const testUser = {
    name: "wishlistuser",
    email: "wishlist-test@mail.com",
    password: "123456",
  };

  beforeAll(async () => {
    // Clear collections
    await Users.deleteMany({});
    await Product.deleteMany({});
    await WishList.deleteMany({});

    // Create and login test user
    const signupRes = await request(app)
      .post("/api/auth/signup")
      .send(testUser);
    authToken = signupRes.body.token;

    // Extract user ID from token instead of querying database
    const jwt = await import("jsonwebtoken");
    const decoded = jwt.default.verify(authToken, process.env.JWT_SECRET);
    userId = decoded.user.id;

    // Create test product
    testProduct = await Product.create({
      id: 1,
      name: "Test Product",
      image: "http://example.com/test.jpg",
      category: "men",
      new_price: 100,
      old_price: 150,
      stock: 10,
      available: true,
    });
  }, 10000);

  afterAll(async () => {
    await Users.deleteMany({});
    await Product.deleteMany({});
    await WishList.deleteMany({});
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    // Clear wishlist before each test
    await WishList.deleteMany({});
  });

  describe("POST /api/user/add-to-wishlist", () => {
    it("should add product to wishlist successfully", async () => {
      const res = await request(app)
        .post("/api/user/add-to-wishlist")
        .set("auth-token", authToken)
        .send({
          userId: userId,
          productId: testProduct._id.toString(),
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("Product added to wishlist");

      // Verify wishlist was created and product added
      const wishlist = await WishList.findOne({ userId });
      expect(wishlist).toBeDefined();
      expect(wishlist.products).toHaveLength(1);
      expect(wishlist.products[0].productId.toString()).toBe(
        testProduct._id.toString(),
      );
    });

    it("should not add duplicate product to wishlist", async () => {
      // Add product first time
      await request(app)
        .post("/api/user/add-to-wishlist")
        .set("auth-token", authToken)
        .send({
          userId: userId,
          productId: testProduct._id.toString(),
        });

      // Try to add same product again
      const res = await request(app)
        .post("/api/user/add-to-wishlist")
        .set("auth-token", authToken)
        .send({
          userId: userId,
          productId: testProduct._id.toString(),
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("Product added to wishlist");

      // Verify only one product in wishlist
      const wishlist = await WishList.findOne({ userId });
      expect(wishlist.products).toHaveLength(1);
    });

    it("should create wishlist if it doesn't exist", async () => {
      const res = await request(app)
        .post("/api/user/add-to-wishlist")
        .set("auth-token", authToken)
        .send({
          userId: userId,
          productId: testProduct._id.toString(),
        });

      expect(res.statusCode).toBe(200);

      const wishlist = await WishList.findOne({ userId });
      expect(wishlist).toBeDefined();
    });

    it("should require authentication", async () => {
      const res = await request(app).post("/api/user/add-to-wishlist").send({
        userId: userId,
        productId: testProduct._id.toString(),
      });

      expect(res.statusCode).toBe(401);
    });
  });

  describe("POST /api/user/remove-from-wishlist", () => {
    beforeEach(async () => {
      // Add product to wishlist before each test
      await request(app)
        .post("/api/user/add-to-wishlist")
        .set("auth-token", authToken)
        .send({
          userId: userId,
          productId: testProduct._id.toString(),
        });
    });

    it("should remove product from wishlist successfully", async () => {
      const res = await request(app)
        .post("/api/user/remove-from-wishlist")
        .set("auth-token", authToken)
        .send({
          userId: userId,
          productId: testProduct._id.toString(),
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("Product removed from wishlist");

      // Verify product was removed
      const wishlist = await WishList.findOne({ userId });
      expect(wishlist.products).toHaveLength(0);
    });

    it("should return error if wishlist doesn't exist", async () => {
      await WishList.deleteMany({});

      const res = await request(app)
        .post("/api/user/remove-from-wishlist")
        .set("auth-token", authToken)
        .send({
          userId: userId,
          productId: testProduct._id.toString(),
        });

      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe("Wishlist not found");
    });

    it("should remove only the specified product", async () => {
      // Add another product
      const anotherProduct = await Product.create({
        id: 2,
        name: "Another Product",
        image: "http://example.com/another.jpg",
        category: "women",
        new_price: 200,
        old_price: 250,
        stock: 5,
        available: true,
      });

      await request(app)
        .post("/api/user/add-to-wishlist")
        .set("auth-token", authToken)
        .send({
          userId: userId,
          productId: anotherProduct._id.toString(),
        });

      // Remove first product
      await request(app)
        .post("/api/user/remove-from-wishlist")
        .set("auth-token", authToken)
        .send({
          userId: userId,
          productId: testProduct._id.toString(),
        });

      // Verify only second product remains
      const wishlist = await WishList.findOne({ userId });
      expect(wishlist.products).toHaveLength(1);
      expect(wishlist.products[0].productId.toString()).toBe(
        anotherProduct._id.toString(),
      );
    });

    it("should require authentication", async () => {
      const res = await request(app)
        .post("/api/user/remove-from-wishlist")
        .send({
          userId: userId,
          productId: testProduct._id.toString(),
        });

      expect(res.statusCode).toBe(401);
    });
  });

  describe("GET /api/user/get-wishlist-items", () => {
    beforeEach(async () => {
      // Add products to wishlist
      await request(app)
        .post("/api/user/add-to-wishlist")
        .set("auth-token", authToken)
        .send({
          productId: testProduct._id.toString(),
        });
    });

    it("should get wishlist with populated products", async () => {
      const res = await request(app)
        .get("/api/user/get-wishlist-items")
        .set("auth-token", authToken);

      expect(res.statusCode).toBe(200);
      expect(res.body.wishlist).toBeDefined();
      expect(res.body.wishlist.products).toHaveLength(1);
      expect(res.body.wishlist.products[0].productId).toBeDefined();
      expect(res.body.wishlist.products[0].productId.name).toBe("Test Product");
    });

    it("should return error if wishlist doesn't exist", async () => {
      await WishList.deleteMany({});

      const res = await request(app)
        .get("/api/user/get-wishlist-items")
        .set("auth-token", authToken);

      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe("Wishlist not found");
    });

    it("should populate product details", async () => {
      const res = await request(app)
        .get("/api/user/get-wishlist-items")
        .set("auth-token", authToken)
        .send({ userId: userId });

      expect(res.statusCode).toBe(200);
      const product = res.body.wishlist.products[0].productId;
      expect(product.name).toBe("Test Product");
      expect(product.new_price).toBe(100);
      expect(product.category).toBe("men");
    });

    it("should require authentication", async () => {
      const res = await request(app).get("/api/user/get-wishlist-items");

      expect(res.statusCode).toBe(401);
    });
  });
});
