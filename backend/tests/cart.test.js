import request from "supertest";
import app from "../src/app.js";
import mongoose from "mongoose";
import Users from "../src/models/UserModel.js";
import Product from "../src/models/ProductModel.js";
import Cart from "../src/models/CartModel.js";

describe("Cart API", () => {
  let authToken;
  let userId;
  let testProduct;

  const testUser = {
    name: "cartuser",
    email: "cart-test@mail.com",
    password: "123456",
  };

  beforeAll(async () => {
    // Clear collections
    await Users.deleteMany({});
    await Product.deleteMany({});
    await Cart.deleteMany({});

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
    await Cart.deleteMany({});
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    // Clear cart before each test
    await Cart.deleteMany({});
    await Users.findByIdAndUpdate(userId, { cartData: {} });
  });

  describe("POST /api/cart/addtocart", () => {
    it("should add product to cart successfully", async () => {
      const res = await request(app)
        .post("/api/cart/addtocart")
        .set("auth-token", authToken)
        .send({
          itemId: testProduct._id.toString(),
          size: "M",
          quantity: 2,
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe("Product added to cart");
      expect(res.body.cart).toBeDefined();
      expect(res.body.cart.products).toHaveLength(1);
      expect(res.body.cart.products[0].quantity).toBe(2);
    });

    it("should return error for non-existent product", async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .post("/api/cart/addtocart")
        .set("auth-token", authToken)
        .send({
          itemId: fakeId.toString(),
          quantity: 1,
        });

      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("Product not found");
    });

    it("should return error when product is out of stock", async () => {
      const outOfStockProduct = await Product.create({
        id: 2,
        name: "Out of Stock Product",
        image: "http://example.com/oos.jpg",
        category: "women",
        new_price: 200,
        old_price: 250,
        stock: 0,
        available: false,
      });

      const res = await request(app)
        .post("/api/cart/addtocart")
        .set("auth-token", authToken)
        .send({
          itemId: outOfStockProduct._id.toString(),
          quantity: 1,
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("Product is out of stock");
    });

    it("should return error when requested quantity exceeds stock", async () => {
      const res = await request(app)
        .post("/api/cart/addtocart")
        .set("auth-token", authToken)
        .send({
          itemId: testProduct._id.toString(),
          quantity: 20, // Stock is only 10
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("Only 10 items available in stock");
    });

    it("should increment quantity for existing product in cart", async () => {
      // Add product first time
      await request(app)
        .post("/api/cart/addtocart")
        .set("auth-token", authToken)
        .send({
          itemId: testProduct._id.toString(),
          size: "M",
          quantity: 2,
        });

      // Add same product again
      const res = await request(app)
        .post("/api/cart/addtocart")
        .set("auth-token", authToken)
        .send({
          itemId: testProduct._id.toString(),
          size: "M",
          quantity: 3,
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.cart.products[0].quantity).toBe(5);
    });

    it("should require authentication", async () => {
      const res = await request(app).post("/api/cart/addtocart").send({
        itemId: testProduct._id.toString(),
        quantity: 1,
      });

      expect(res.statusCode).toBe(401);
    });
  });

  describe("POST /api/cart/removefromcart", () => {
    beforeEach(async () => {
      // Add product to cart before each test
      await request(app)
        .post("/api/cart/addtocart")
        .set("auth-token", authToken)
        .send({
          itemId: testProduct._id.toString(),
          size: "M",
          quantity: 5,
        });
    });

    it("should remove quantity from cart successfully", async () => {
      const res = await request(app)
        .post("/api/cart/removefromcart")
        .set("auth-token", authToken)
        .send({
          itemId: testProduct._id.toString(),
          size: "M",
          quantity: 2,
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe("Product removed from cart");
      expect(res.body.cart.products[0].quantity).toBe(3);
    });

    it("should remove product completely when quantity becomes 0", async () => {
      const res = await request(app)
        .post("/api/cart/removefromcart")
        .set("auth-token", authToken)
        .send({
          itemId: testProduct._id.toString(),
          size: "M",
          quantity: 5,
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.cart).toBeNull();
    });

    it("should require authentication", async () => {
      const res = await request(app).post("/api/cart/removefromcart").send({
        itemId: testProduct._id.toString(),
        quantity: 1,
      });

      expect(res.statusCode).toBe(401);
    });
  });

  describe("GET /api/cart/getcart", () => {
    it("should get empty cart for user with no items", async () => {
      const res = await request(app)
        .get("/api/cart/getcart")
        .set("auth-token", authToken);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.cartData).toEqual({});
      expect(res.body.cart).toBeNull();
    });

    it("should get cart with items", async () => {
      // Add product to cart
      await request(app)
        .post("/api/cart/addtocart")
        .set("auth-token", authToken)
        .send({
          itemId: testProduct._id.toString(),
          size: "M",
          quantity: 2,
        });

      const res = await request(app)
        .get("/api/cart/getcart")
        .set("auth-token", authToken);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.cart).toBeDefined();
      expect(res.body.cart.products).toHaveLength(1);
      expect(res.body.cart.products[0].productId).toBeDefined();
    });

    it("should require authentication", async () => {
      const res = await request(app).get("/api/cart/getcart");

      expect(res.statusCode).toBe(401);
    });
  });

  describe("POST /api/cart/clearcart", () => {
    beforeEach(async () => {
      // Add product to cart
      await request(app)
        .post("/api/cart/addtocart")
        .set("auth-token", authToken)
        .send({
          itemId: testProduct._id.toString(),
          quantity: 2,
        });
    });

    it("should clear cart successfully", async () => {
      const res = await request(app)
        .post("/api/cart/clearcart")
        .set("auth-token", authToken);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe("Cart cleared successfully");

      // Verify cart is empty
      const cartRes = await request(app)
        .get("/api/cart/getcart")
        .set("auth-token", authToken);
      expect(cartRes.body.cart).toBeNull();
    });

    it("should require authentication", async () => {
      const res = await request(app).post("/api/cart/clearcart");

      expect(res.statusCode).toBe(401);
    });
  });

  describe("PUT /api/cart/updatecart", () => {
    beforeEach(async () => {
      // Add product to cart
      await request(app)
        .post("/api/cart/addtocart")
        .set("auth-token", authToken)
        .send({
          itemId: testProduct._id.toString(),
          size: "M",
          quantity: 2,
        });
    });

    it("should update cart item quantity successfully", async () => {
      const res = await request(app)
        .put("/api/cart/updatecart")
        .set("auth-token", authToken)
        .send({
          itemId: testProduct._id.toString(),
          size: "M",
          quantity: 5,
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe("Cart updated successfully");
      expect(res.body.cart.products[0].quantity).toBe(5);
    });

    it("should return error for negative quantity", async () => {
      const res = await request(app)
        .put("/api/cart/updatecart")
        .set("auth-token", authToken)
        .send({
          itemId: testProduct._id.toString(),
          size: "M",
          quantity: -1,
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("Quantity cannot be negative");
    });

    it("should return error when quantity exceeds stock", async () => {
      const res = await request(app)
        .put("/api/cart/updatecart")
        .set("auth-token", authToken)
        .send({
          itemId: testProduct._id.toString(),
          size: "M",
          quantity: 20,
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("Only 10 items available in stock");
    });

    it("should remove item when quantity is set to 0", async () => {
      const res = await request(app)
        .put("/api/cart/updatecart")
        .set("auth-token", authToken)
        .send({
          itemId: testProduct._id.toString(),
          size: "M",
          quantity: 0,
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it("should require authentication", async () => {
      const res = await request(app).put("/api/cart/updatecart").send({
        itemId: testProduct._id.toString(),
        quantity: 3,
      });

      expect(res.statusCode).toBe(401);
    });
  });
});
