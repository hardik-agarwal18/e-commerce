import request from "supertest";
import app from "../src/app.js";
import prisma from "../src/config/prisma.js";

describe("Product API", () => {
  let adminToken;

  const testProduct = {
    name: "Test Product",
    image: "http://example.com/test.jpg",
    category: "men",
    new_price: 100,
    old_price: 150,
    stock: 10,
  };

  beforeAll(async () => {
    const loginRes = await request(app).post("/api/admin/login").send({
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
    });

    adminToken = loginRes.body.token;
  });

  describe("POST /api/products/addproduct", () => {
    it("should add product successfully", async () => {
      const res = await request(app)
        .post("/api/products/addproduct")
        .set("auth-token", adminToken)
        .send(testProduct);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe("Product Added");

      const products = await prisma.product.findMany();

      expect(products).toHaveLength(1);
      expect(products[0].name).toBe(testProduct.name);
      expect(products[0].available).toBe(true);
    });

    it("should require authentication", async () => {
      const res = await request(app)
        .post("/api/products/addproduct")
        .send(testProduct);

      expect(res.statusCode).toBe(401);
    });

    it("should calculate stock from sizeStock", async () => {
      const res = await request(app)
        .post("/api/products/addproduct")
        .set("auth-token", adminToken)
        .send({
          name: "Sized Product",
          image: "http://example.com/image.jpg",
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
        });

      expect(res.statusCode).toBe(200);

      const product = await prisma.product.findFirst({
        where: {
          name: "Sized Product",
        },
      });

      expect(product.stock).toBe(26);
      expect(product.available).toBe(true);
    });
  });

  describe("GET /api/products/getallproducts", () => {
    it("should return empty array", async () => {
      const res = await request(app).get("/api/products/getallproducts");

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body).toHaveLength(0);
    });

    it("should return all products", async () => {
      await request(app)
        .post("/api/products/addproduct")
        .set("auth-token", adminToken)
        .send(testProduct);

      await request(app)
        .post("/api/products/addproduct")
        .set("auth-token", adminToken)
        .send({
          ...testProduct,
          name: "Product 2",
        });

      const res = await request(app).get("/api/products/getallproducts");

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveLength(2);
    });
  });

  describe("GET /api/products/product/:id", () => {
    let productId;

    beforeEach(async () => {
      await request(app)
        .post("/api/products/addproduct")
        .set("auth-token", adminToken)
        .send(testProduct);

      const product = await prisma.product.findFirst({
        where: {
          name: testProduct.name,
        },
      });

      productId = product.id;
    });

    it("should get product by id", async () => {
      const res = await request(app).get(`/api/products/product/${productId}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);

      expect(res.body.product.id).toBe(productId);
      expect(res.body.product.name).toBe(testProduct.name);
      expect(res.body.product.category).toBe(testProduct.category);
      expect(res.body.product.new_price).toBe(testProduct.new_price);
      expect(res.body.product.old_price).toBe(testProduct.old_price);
    });

    it("should return 404 for non-existing product", async () => {
      const res = await request(app).get(
        "/api/products/product/11111111-1111-1111-1111-111111111111",
      );

      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  describe("PUT /api/products/updateproduct", () => {
    let productId;

    beforeEach(async () => {
      await request(app)
        .post("/api/products/addproduct")
        .set("auth-token", adminToken)
        .send(testProduct);

      const product = await prisma.product.findFirst({
        where: {
          name: testProduct.name,
        },
      });

      productId = product.id;
    });

    it("should update product", async () => {
      const res = await request(app)
        .put("/api/products/updateproduct")
        .set("auth-token", adminToken)
        .send({
          id: productId,
          name: "Updated Product",
          new_price: 500,
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);

      const product = await prisma.product.findUnique({
        where: {
          id: productId,
        },
      });

      expect(product.name).toBe("Updated Product");
      expect(Number(product.newPrice)).toBe(500);
    });

    it("should return 400 when id missing", async () => {
      const res = await request(app)
        .put("/api/products/updateproduct")
        .set("auth-token", adminToken)
        .send({
          name: "Updated Product",
        });

      expect(res.statusCode).toBe(400);
    });
  });

  describe("POST /api/products/removeproduct", () => {
    let productId;

    beforeEach(async () => {
      await request(app)
        .post("/api/products/addproduct")
        .set("auth-token", adminToken)
        .send(testProduct);

      const product = await prisma.product.findFirst({
        where: {
          name: testProduct.name,
        },
      });

      productId = product.id;
    });

    it("should remove product", async () => {
      const res = await request(app)
        .post("/api/products/removeproduct")
        .set("auth-token", adminToken)
        .send({
          id: productId,
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);

      const deleted = await prisma.product.findUnique({
        where: {
          id: productId,
        },
      });

      expect(deleted).toBeNull();
    });

    it("should return 404 when product not found", async () => {
      const res = await request(app)
        .post("/api/products/removeproduct")
        .set("auth-token", adminToken)
        .send({
          id: "11111111-1111-1111-1111-111111111111",
        });

      expect(res.statusCode).toBe(404);
    });
  });

  describe("GET /api/products/newcollection", () => {
    it("should return at most 8 products", async () => {
      for (let i = 0; i < 10; i++) {
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
      expect(res.body.newcollection.length).toBe(8);
    });
  });

  describe("GET /api/products/popularinwomen", () => {
    it("should return at most 4 women products", async () => {
      for (let i = 0; i < 6; i++) {
        await request(app)
          .post("/api/products/addproduct")
          .set("auth-token", adminToken)
          .send({
            ...testProduct,
            category: "women",
            name: `Women Product ${i}`,
          });
      }

      const res = await request(app).get("/api/products/popularinwomen");

      expect(res.statusCode).toBe(200);
      expect(res.body.popularinwomen.length).toBe(4);

      res.body.popularinwomen.forEach((product) => {
        expect(product.category).toBe("women");
      });
    });
  });
});
