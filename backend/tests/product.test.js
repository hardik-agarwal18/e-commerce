import request from "supertest";
import app from "../src/app.js";
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
      expect(products[0]._id).toBeDefined();
      expect(products[0].available).toBe(true);
    });

    it("should create products with unique MongoDB IDs", async () => {
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

      const products = await Product.find({});
      expect(products).toHaveLength(2);
      expect(products[0]._id).toBeDefined();
      expect(products[1]._id).toBeDefined();
      expect(products[0]._id.toString()).not.toBe(products[1]._id.toString());
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
      productId = product._id.toString();
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
      const product = await Product.findById(productId);
      expect(product).toBeNull();
    });

    it("should return error for non-existent product", async () => {
      const res = await request(app)
        .post("/api/products/removeproduct")
        .set("auth-token", adminToken)
        .send({ id: "507f1f77bcf86cd799439011" }); // Valid MongoDB ObjectId format

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

  describe("Size-wise Stock Management", () => {
    const productWithSizeStock = {
      name: "Sized Product",
      image: "http://example.com/sized.jpg",
      category: "men",
      new_price: 100,
      old_price: 150,
      sizeStock: {
        S: 5,
        M: 10,
        L: 8,
        XL: 3,
        XXL: 0,
      },
    };

    it("should add product with size-wise stock", async () => {
      const res = await request(app)
        .post("/api/products/addproduct")
        .set("auth-token", adminToken)
        .send(productWithSizeStock);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);

      const product = await Product.findOne({
        name: productWithSizeStock.name,
      });
      expect(product).toBeDefined();
      expect(product.sizeStock).toBeDefined();

      // Convert Map to object for comparison if needed
      const sizeStockObj =
        product.sizeStock instanceof Map
          ? Object.fromEntries(product.sizeStock)
          : product.sizeStock;

      expect(sizeStockObj.S).toBe(5);
      expect(sizeStockObj.M).toBe(10);
      expect(sizeStockObj.L).toBe(8);
      expect(sizeStockObj.XL).toBe(3);
      expect(sizeStockObj.XXL).toBe(0);
    });

    it("should calculate total stock from sizeStock", async () => {
      const res = await request(app)
        .post("/api/products/addproduct")
        .set("auth-token", adminToken)
        .send(productWithSizeStock);

      expect(res.statusCode).toBe(200);

      const product = await Product.findOne({
        name: productWithSizeStock.name,
      });
      expect(product.stock).toBe(26); // 5+10+8+3+0
      expect(product.available).toBe(true);
    });

    it("should set available to true when total stock > 0", async () => {
      const res = await request(app)
        .post("/api/products/addproduct")
        .set("auth-token", adminToken)
        .send(productWithSizeStock);

      expect(res.statusCode).toBe(200);

      const product = await Product.findOne({
        name: productWithSizeStock.name,
      });
      expect(product.available).toBe(true);
    });

    it("should set available to false when all sizes out of stock", async () => {
      const outOfStockProduct = {
        ...productWithSizeStock,
        name: "Out of Stock Sized Product",
        sizeStock: {
          S: 0,
          M: 0,
          L: 0,
          XL: 0,
          XXL: 0,
        },
      };

      const res = await request(app)
        .post("/api/products/addproduct")
        .set("auth-token", adminToken)
        .send(outOfStockProduct);

      expect(res.statusCode).toBe(200);

      const product = await Product.findOne({ name: outOfStockProduct.name });
      expect(product.stock).toBe(0);
      expect(product.available).toBe(false);
    });

    it("should use default sizeStock if not provided", async () => {
      const productWithoutSizeStock = {
        name: "Product Without SizeStock",
        image: "http://example.com/nosizes.jpg",
        category: "women",
        new_price: 80,
        old_price: 120,
        stock: 15,
      };

      const res = await request(app)
        .post("/api/products/addproduct")
        .set("auth-token", adminToken)
        .send(productWithoutSizeStock);

      expect(res.statusCode).toBe(200);

      const product = await Product.findOne({
        name: productWithoutSizeStock.name,
      });
      expect(product.sizeStock).toBeDefined();

      const sizeStockObj =
        product.sizeStock instanceof Map
          ? Object.fromEntries(product.sizeStock)
          : product.sizeStock;

      expect(sizeStockObj.S).toBe(0);
      expect(sizeStockObj.M).toBe(0);
      expect(sizeStockObj.L).toBe(0);
      expect(sizeStockObj.XL).toBe(0);
      expect(sizeStockObj.XXL).toBe(0);
    });
  });

  describe("PUT /api/products/updateproduct", () => {
    let productId;

    beforeEach(async () => {
      // Create a product to update
      const res = await request(app)
        .post("/api/products/addproduct")
        .set("auth-token", adminToken)
        .send(testProduct);

      const product = await Product.findOne({ name: testProduct.name });
      productId = product.id;
    });

    it("should update product successfully with all fields", async () => {
      const updatedData = {
        id: productId,
        name: "Updated Product Name",
        image: "http://example.com/updated.jpg",
        category: "women",
        new_price: 120,
        old_price: 180,
        stock: 50,
      };

      const res = await request(app)
        .put("/api/products/updateproduct")
        .set("auth-token", adminToken)
        .send(updatedData);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe("Product Updated Successfully");
      expect(res.body.product).toBeDefined();
      expect(res.body.product.name).toBe(updatedData.name);
      expect(res.body.product.category).toBe(updatedData.category);
      expect(res.body.product.new_price).toBe(updatedData.new_price);
      expect(res.body.product.old_price).toBe(updatedData.old_price);

      // Verify in database
      const product = await Product.findById(productId);
      expect(product.name).toBe(updatedData.name);
      expect(product.image).toBe(updatedData.image);
    });

    it("should update product with partial fields", async () => {
      const updatedData = {
        id: productId,
        name: "Partially Updated Product",
        new_price: 95,
      };

      const res = await request(app)
        .put("/api/products/updateproduct")
        .set("auth-token", adminToken)
        .send(updatedData);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);

      const product = await Product.findById(productId);
      expect(product.name).toBe(updatedData.name);
      expect(product.new_price).toBe(updatedData.new_price);
      // Old fields should remain unchanged
      expect(product.category).toBe(testProduct.category);
      expect(product.old_price).toBe(testProduct.old_price);
    });

    it("should update product with sizeStock and recalculate total stock", async () => {
      const updatedData = {
        id: productId,
        sizeStock: {
          S: 10,
          M: 15,
          L: 20,
          XL: 5,
          XXL: 0,
        },
      };

      const res = await request(app)
        .put("/api/products/updateproduct")
        .set("auth-token", adminToken)
        .send(updatedData);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);

      const product = await Product.findById(productId);
      expect(product.stock).toBe(50); // 10+15+20+5+0
      expect(product.available).toBe(true);

      const sizeStockObj =
        product.sizeStock instanceof Map
          ? Object.fromEntries(product.sizeStock)
          : product.sizeStock;

      expect(sizeStockObj.S).toBe(10);
      expect(sizeStockObj.M).toBe(15);
      expect(sizeStockObj.L).toBe(20);
    });

    it("should set availability to false when updating to zero stock", async () => {
      const updatedData = {
        id: productId,
        sizeStock: {
          S: 0,
          M: 0,
          L: 0,
          XL: 0,
          XXL: 0,
        },
      };

      const res = await request(app)
        .put("/api/products/updateproduct")
        .set("auth-token", adminToken)
        .send(updatedData);

      expect(res.statusCode).toBe(200);

      const product = await Product.findById(productId);
      expect(product.stock).toBe(0);
      expect(product.available).toBe(false);
    });

    it("should set availability to true when updating from zero to positive stock", async () => {
      // First set stock to zero
      await Product.findByIdAndUpdate(productId, {
        stock: 0,
        available: false,
      });

      const updatedData = {
        id: productId,
        stock: 25,
      };

      const res = await request(app)
        .put("/api/products/updateproduct")
        .set("auth-token", adminToken)
        .send(updatedData);

      expect(res.statusCode).toBe(200);

      const product = await Product.findById(productId);
      expect(product.stock).toBe(25);
      expect(product.available).toBe(true);
    });

    it("should return 404 for non-existent product", async () => {
      const updatedData = {
        id: "507f1f77bcf86cd799439011", // Valid MongoDB ObjectId that doesn't exist
        name: "Non-existent Product",
      };

      const res = await request(app)
        .put("/api/products/updateproduct")
        .set("auth-token", adminToken)
        .send(updatedData);

      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("Product not found");
    });

    it("should require admin authentication", async () => {
      const updatedData = {
        id: productId,
        name: "Updated Product",
      };

      const res = await request(app)
        .put("/api/products/updateproduct")
        .send(updatedData);

      expect(res.statusCode).toBe(401);
    });

    it("should return error when id is missing", async () => {
      const updatedData = {
        name: "Product without ID",
      };

      const res = await request(app)
        .put("/api/products/updateproduct")
        .set("auth-token", adminToken)
        .send(updatedData);

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe("GET /api/products/product/:id", () => {
    let productId;

    beforeEach(async () => {
      // Create a product to retrieve
      const res = await request(app)
        .post("/api/products/addproduct")
        .set("auth-token", adminToken)
        .send(testProduct);

      const product = await Product.findOne({ name: testProduct.name });
      productId = product.id;
    });

    it("should get product by id successfully", async () => {
      const res = await request(app).get(`/api/products/product/${productId}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.product).toBeDefined();
      expect(res.body.product._id).toBe(productId);
      expect(res.body.product.name).toBe(testProduct.name);
      expect(res.body.product.category).toBe(testProduct.category);
      expect(res.body.product.new_price).toBe(testProduct.new_price);
      expect(res.body.product.old_price).toBe(testProduct.old_price);
    });

    it("should return complete product data including sizeStock", async () => {
      // Create a product with sizeStock
      const productWithSizes = {
        name: "Product with Sizes",
        image: "http://example.com/sizes.jpg",
        category: "men",
        new_price: 150,
        old_price: 200,
        sizeStock: {
          S: 5,
          M: 10,
          L: 8,
          XL: 3,
          XXL: 2,
        },
      };

      await request(app)
        .post("/api/products/addproduct")
        .set("auth-token", adminToken)
        .send(productWithSizes);

      const product = await Product.findOne({ name: productWithSizes.name });

      const res = await request(app).get(
        `/api/products/product/${product._id}`,
      );

      expect(res.statusCode).toBe(200);
      expect(res.body.product.sizeStock).toBeDefined();
      expect(res.body.product.stock).toBe(28); // 5+10+8+3+2
      expect(res.body.product.available).toBe(true);
    });

    it("should return 404 for non-existent product id", async () => {
      const res = await request(app).get(
        `/api/products/product/507f1f77bcf86cd799439011`,
      ); // Valid MongoDB ObjectId format

      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("Product not found");
    });

    it("should return 404 for invalid product id format", async () => {
      const res = await request(app).get(`/api/products/product/invalid-id`);

      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
    });

    it("should not require authentication", async () => {
      const res = await request(app).get(`/api/products/product/${productId}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it("should return proper data structure", async () => {
      const res = await request(app).get(`/api/products/product/${productId}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("success");
      expect(res.body).toHaveProperty("product");
      expect(res.body.product).toHaveProperty("_id");
      expect(res.body.product).toHaveProperty("name");
      expect(res.body.product).toHaveProperty("image");
      expect(res.body.product).toHaveProperty("category");
      expect(res.body.product).toHaveProperty("new_price");
      expect(res.body.product).toHaveProperty("old_price");
      expect(res.body.product).toHaveProperty("stock");
      expect(res.body.product).toHaveProperty("available");
    });
  });
});
