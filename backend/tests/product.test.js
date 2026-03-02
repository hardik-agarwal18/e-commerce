import request from "supertest";
import app from "../src/app.js";
import mongoose from "mongoose";
import Product from "../src/models/ProductModel.js";

describe("Product API", () => {
  let adminToken;

  const adminUser = {
    email: "admin@example.com",
    password: "admin123",
  };

  const testProduct = {
    name: "Test Product",
    image: "http://example.com/test.jpg",
    category: "men",
    new_price: 100,
    old_price: 150,
    stock: 10,
  };

  beforeAll(async () => {
    // Set admin credentials in environment variables for testing
    process.env.ADMIN_EMAIL = adminUser.email;
    process.env.ADMIN_PASSWORD = adminUser.password;

    // Login as admin
    const loginRes = await request(app)
      .post("/api/admin/login")
      .send(adminUser);
    adminToken = loginRes.body.token;
  });

  beforeEach(async () => {
    // Clear products collection before each test
    await Product.deleteMany({});
  });

  afterAll(async () => {
    await Product.deleteMany({});
    await mongoose.connection.close();
  });

  describe("POST /api/products/addproduct", () => {
    it("should add a new product successfully", async () => {
      const res = await request(app)
        .post("/api/products/addproduct")
        .set("auth-token", adminToken)
        .send(testProduct);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe("Product Added");

      // Verify product was added
      const products = await Product.find({});
      expect(products).toHaveLength(1);
      expect(products[0].name).toBe(testProduct.name);
      expect(products[0].id).toBe(1);
      expect(products[0].available).toBe(true);
    });

    it("should auto-increment product id", async () => {
      // Add first product
      await request(app)
        .post("/api/products/addproduct")
        .set("auth-token", adminToken)
        .send(testProduct);

      // Add second product
      const res = await request(app)
        .post("/api/products/addproduct")
        .set("auth-token", adminToken)
        .send({
          ...testProduct,
          name: "Second Product",
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);

      const products = await Product.find({}).sort({ id: 1 });
      expect(products).toHaveLength(2);
      expect(products[0].id).toBe(1);
      expect(products[1].id).toBe(2);
    });

    it("should set available to true when stock is greater than 0", async () => {
      await request(app)
        .post("/api/products/addproduct")
        .set("auth-token", adminToken)
        .send({ ...testProduct, stock: 5 });

      const product = await Product.findOne({ name: testProduct.name });
      expect(product.available).toBe(true);
    });

    it("should set available to false when stock is 0", async () => {
      await request(app)
        .post("/api/products/addproduct")
        .set("auth-token", adminToken)
        .send({ ...testProduct, stock: 0 });

      const product = await Product.findOne({ name: testProduct.name });
      expect(product.available).toBe(false);
    });

    it("should require admin authentication", async () => {
      const res = await request(app)
        .post("/api/products/addproduct")
        .send(testProduct);

      expect(res.statusCode).toBe(401);
    });
  });

  describe("POST /api/products/removeproduct", () => {
    let productId;

    beforeEach(async () => {
      // Add a product first
      await request(app)
        .post("/api/products/addproduct")
        .set("auth-token", adminToken)
        .send(testProduct);

      const product = await Product.findOne({ name: testProduct.name });
      productId = product.id;
    });

    it("should remove product successfully", async () => {
      const res = await request(app)
        .post("/api/products/removeproduct")
        .set("auth-token", adminToken)
        .send({ id: productId });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe("Removed the Product");
      expect(res.body.name).toBe(testProduct.name);

      // Verify product was removed
      const product = await Product.findOne({ id: productId });
      expect(product).toBeNull();
    });

    it("should return error for non-existent product", async () => {
      const res = await request(app)
        .post("/api/products/removeproduct")
        .set("auth-token", adminToken)
        .send({ id: 9999 });

      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("Product not found");
    });

    it("should require admin authentication", async () => {
      const res = await request(app)
        .post("/api/products/removeproduct")
        .send({ id: productId });

      expect(res.statusCode).toBe(401);
    });
  });

  describe("GET /api/products/getallproducts", () => {
    it("should return empty array when no products exist", async () => {
      const res = await request(app).get("/api/products/getallproducts");

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body).toHaveLength(0);
    });

    it("should return all products", async () => {
      // Add multiple products
      const products = [
        { ...testProduct, name: "Product 1" },
        { ...testProduct, name: "Product 2", category: "women" },
        { ...testProduct, name: "Product 3", category: "kids" },
      ];

      for (const product of products) {
        await request(app)
          .post("/api/products/addproduct")
          .set("auth-token", adminToken)
          .send(product);
      }

      const res = await request(app).get("/api/products/getallproducts");

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body).toHaveLength(3);
    });

    it("should not require authentication", async () => {
      const res = await request(app).get("/api/products/getallproducts");

      expect(res.statusCode).toBe(200);
    });
  });

  describe("GET /api/products/newcollection", () => {
    it("should return 8 most recent products", async () => {
      // Add 10 products
      for (let i = 1; i <= 10; i++) {
        await request(app)
          .post("/api/products/addproduct")
          .set("auth-token", adminToken)
          .send({
            ...testProduct,
            name: `Product ${i}`,
          });
      }

      const res = await request(app).get("/api/products/newcollection");

      expect(res.statusCode).toBe(200);
      expect(res.body.newcollection).toBeDefined();
      expect(res.body.newcollection).toHaveLength(8);
    });

    it("should return empty when no products exist", async () => {
      const res = await request(app).get("/api/products/newcollection");

      expect(res.statusCode).toBe(200);
      expect(res.body.newcollection).toBeDefined();
      expect(res.body.newcollection).toHaveLength(0);
    });

    it("should return all products if less than 8 exist", async () => {
      // Add only 5 products
      for (let i = 1; i <= 5; i++) {
        await request(app)
          .post("/api/products/addproduct")
          .set("auth-token", adminToken)
          .send({
            ...testProduct,
            name: `Product ${i}`,
          });
      }

      const res = await request(app).get("/api/products/newcollection");

      expect(res.statusCode).toBe(200);
      expect(res.body.newcollection).toBeDefined();
      expect(res.body.newcollection).toHaveLength(4);
    });
  });

  describe("GET /api/products/popularinwomen", () => {
    beforeEach(async () => {
      // Add women's products
      for (let i = 1; i <= 6; i++) {
        await request(app)
          .post("/api/products/addproduct")
          .set("auth-token", adminToken)
          .send({
            ...testProduct,
            name: `Women Product ${i}`,
            category: "women",
          });
      }

      // Add some men's products
      for (let i = 1; i <= 3; i++) {
        await request(app)
          .post("/api/products/addproduct")
          .set("auth-token", adminToken)
          .send({
            ...testProduct,
            name: `Men Product ${i}`,
            category: "men",
          });
      }
    });

    it("should return 4 most recent women's products", async () => {
      const res = await request(app).get("/api/products/popularinwomen");

      expect(res.statusCode).toBe(200);
      expect(res.body.popularinwomen).toBeDefined();
      expect(res.body.popularinwomen).toHaveLength(4);

      // All products should be women's category
      res.body.popularinwomen.forEach((product) => {
        expect(product.category).toBe("women");
      });
    });

    it("should return empty when no women's products exist", async () => {
      await Product.deleteMany({});

      const res = await request(app).get("/api/products/popularinwomen");

      expect(res.statusCode).toBe(200);
      expect(res.body.popularinwomen).toBeDefined();
      expect(res.body.popularinwomen).toHaveLength(0);
    });

    it("should return all women products if less than 4 exist", async () => {
      await Product.deleteMany({});

      // Add only 2 women's products
      for (let i = 1; i <= 2; i++) {
        await request(app)
          .post("/api/products/addproduct")
          .set("auth-token", adminToken)
          .send({
            ...testProduct,
            name: `Women Product ${i}`,
            category: "women",
          });
      }

      const res = await request(app).get("/api/products/popularinwomen");

      expect(res.statusCode).toBe(200);
      expect(res.body.popularinwomen).toBeDefined();
      expect(res.body.popularinwomen).toHaveLength(1);
    });
  });
});
