import request from "supertest";
import app from "../src/app.js";
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
      sizeStock: {
        S: 10,
        M: 10,
        L: 10,
        XL: 10,
        XXL: 10,
      },
      available: true,
    });
  }, 10000);

  afterAll(async () => {
    await Users.deleteMany({});
    await Product.deleteMany({});
    await Cart.deleteMany({});
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
        sizeStock: {
          S: 0,
          M: 0,
          L: 0,
          XL: 0,
          XXL: 0,
        },
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

  describe("Size-wise Stock in Cart", () => {
    let sizedProduct;

    beforeAll(async () => {
      // Create product with size-wise stock
      sizedProduct = await Product.create({
        id: 10,
        name: "Sized T-Shirt",
        image: "http://example.com/tshirt.jpg",
        category: "men",
        new_price: 50,
        old_price: 75,
        stock: 23,
        sizeStock: {
          S: 5,
          M: 8,
          L: 7,
          XL: 3,
          XXL: 0,
        },
        available: true,
      });
    });

    beforeEach(async () => {
      await Cart.deleteMany({});
      await Users.findByIdAndUpdate(userId, { cartData: {} });
    });

    it("should add product with specific size to cart", async () => {
      const res = await request(app)
        .post("/api/cart/addtocart")
        .set("auth-token", authToken)
        .send({
          itemId: sizedProduct._id.toString(),
          size: "M",
          quantity: 2,
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.cart.products).toHaveLength(1);
      expect(res.body.cart.products[0].size).toBe("M");
      expect(res.body.cart.products[0].quantity).toBe(2);
    });

    it("should reject when size is out of stock", async () => {
      const res = await request(app)
        .post("/api/cart/addtocart")
        .set("auth-token", authToken)
        .send({
          itemId: sizedProduct._id.toString(),
          size: "XXL",
          quantity: 1,
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain("Size XXL is out of stock");
    });

    it("should reject when quantity exceeds size-specific stock", async () => {
      const res = await request(app)
        .post("/api/cart/addtocart")
        .set("auth-token", authToken)
        .send({
          itemId: sizedProduct._id.toString(),
          size: "XL",
          quantity: 5, // Only 3 available in XL
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain("Only 3 items available in size XL");
    });

    it("should allow adding same product with different sizes", async () => {
      // Add size M
      await request(app)
        .post("/api/cart/addtocart")
        .set("auth-token", authToken)
        .send({
          itemId: sizedProduct._id.toString(),
          size: "M",
          quantity: 2,
        });

      // Add size L
      const res = await request(app)
        .post("/api/cart/addtocart")
        .set("auth-token", authToken)
        .send({
          itemId: sizedProduct._id.toString(),
          size: "L",
          quantity: 3,
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.cart.products).toHaveLength(2);

      const sizes = res.body.cart.products.map((p) => p.size);
      expect(sizes).toContain("M");
      expect(sizes).toContain("L");
    });

    it("should increment quantity for same product and size", async () => {
      // Add first time
      await request(app)
        .post("/api/cart/addtocart")
        .set("auth-token", authToken)
        .send({
          itemId: sizedProduct._id.toString(),
          size: "M",
          quantity: 2,
        });

      // Add again with same size
      const res = await request(app)
        .post("/api/cart/addtocart")
        .set("auth-token", authToken)
        .send({
          itemId: sizedProduct._id.toString(),
          size: "M",
          quantity: 3,
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.cart.products).toHaveLength(1);
      expect(res.body.cart.products[0].quantity).toBe(5);
    });

    it("should remove product with specific size from cart", async () => {
      // Add two different sizes
      await request(app)
        .post("/api/cart/addtocart")
        .set("auth-token", authToken)
        .send({
          itemId: sizedProduct._id.toString(),
          size: "M",
          quantity: 4,
        });

      await request(app)
        .post("/api/cart/addtocart")
        .set("auth-token", authToken)
        .send({
          itemId: sizedProduct._id.toString(),
          size: "L",
          quantity: 3,
        });

      // Remove only size M
      const res = await request(app)
        .post("/api/cart/removefromcart")
        .set("auth-token", authToken)
        .send({
          itemId: sizedProduct._id.toString(),
          size: "M",
          quantity: 2,
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);

      const cart = await Cart.findOne({ userId });
      expect(cart.products).toHaveLength(2);

      const mProduct = cart.products.find((p) => p.size === "M");
      const lProduct = cart.products.find((p) => p.size === "L");

      expect(mProduct.quantity).toBe(2);
      expect(lProduct.quantity).toBe(3);
    });

    it("should validate stock for each size independently", async () => {
      // S has 5 items
      const res1 = await request(app)
        .post("/api/cart/addtocart")
        .set("auth-token", authToken)
        .send({
          itemId: sizedProduct._id.toString(),
          size: "S",
          quantity: 5,
        });

      expect(res1.statusCode).toBe(200);

      // Try to add 6 items in size S (should fail)
      await Cart.deleteMany({});

      const res2 = await request(app)
        .post("/api/cart/addtocart")
        .set("auth-token", authToken)
        .send({
          itemId: sizedProduct._id.toString(),
          size: "S",
          quantity: 6,
        });

      expect(res2.statusCode).toBe(400);
      expect(res2.body.message).toContain("Only 5 items available in size S");
    });
  });
});
