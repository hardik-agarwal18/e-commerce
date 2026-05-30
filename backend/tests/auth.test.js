import request from "supertest";
import app from "../src/app.js";
import prisma from "../src/config/prisma.js";

describe("Auth API", () => {
  const testUser = {
    name: "testuser",
    email: "[test@mail.com](mailto:test@mail.com)",
    password: "123456",
  };

  beforeEach(async () => {
    await prisma.cartItem.deleteMany();

    await prisma.cart.deleteMany();

    await prisma.wishlistItem.deleteMany();

    await prisma.wishlist.deleteMany();

    await prisma.user.deleteMany({
      where: {
        email: {
          in: ["test@mail.com"],
        },
      },
    });
  });

  afterAll(async () => {
    await prisma.cartItem.deleteMany();

    await prisma.cart.deleteMany();

    await prisma.wishlistItem.deleteMany();

    await prisma.wishlist.deleteMany();

    await prisma.user.deleteMany({
      where: {
        email: {
          in: ["test@mail.com"],
        },
      },
    });

    await prisma.$disconnect();
  });

  describe("POST /api/auth/signup", () => {
    it("should register a new user", async () => {
      const res = await request(app).post("/api/auth/signup").send(testUser);

      expect(res.statusCode).toBe(201);

      expect(res.body.success).toBe(true);

      expect(res.body.token).toBeDefined();

      const user = await prisma.user.findUnique({
        where: {
          email: testUser.email,
        },
      });

      expect(user).not.toBeNull();

      expect(user.email).toBe(testUser.email);
    });

    it("should create cart automatically", async () => {
      await request(app).post("/api/auth/signup").send(testUser);

      const user = await prisma.user.findUnique({
        where: {
          email: testUser.email,
        },
        include: {
          cart: true,
        },
      });

      expect(user.cart).toBeDefined();

      expect(Number(user.cart.totalAmount)).toBe(0);
    });

    it("should create wishlist automatically", async () => {
      await request(app).post("/api/auth/signup").send(testUser);

      const user = await prisma.user.findUnique({
        where: {
          email: testUser.email,
        },
        include: {
          wishlist: true,
        },
      });

      expect(user.wishlist).toBeDefined();
    });

    it("should not register user with existing email", async () => {
      await request(app).post("/api/auth/signup").send(testUser);

      const res = await request(app)
        .post("/api/auth/signup")
        .send({
          ...testUser,
          name: "testuser2",
        });

      expect(res.statusCode).toBe(400);

      expect(res.body.success).toBe(false);

      expect(res.body.message).toBe("User Exists");
    });
  });

  describe("POST /api/auth/login", () => {
    beforeEach(async () => {
      await request(app).post("/api/auth/signup").send(testUser);
    });

    it("should login user with correct credentials", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: testUser.email,
        password: testUser.password,
      });

      expect(res.statusCode).toBe(200);

      expect(res.body.success).toBe(true);

      expect(res.body.token).toBeDefined();
    });

    it("should set auth cookie", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: testUser.email,
        password: testUser.password,
      });

      expect(res.headers["set-cookie"]).toBeDefined();
    });

    it("should not login user with wrong password", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: testUser.email,
        password: "wrongpassword",
      });

      expect(res.statusCode).toBe(401);

      expect(res.body.success).toBe(false);

      expect(res.body.message).toBe("Wrong Password");
    });

    it("should not login user that does not exist", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: "nonexistent@mail.com",
        password: "123456",
      });

      expect(res.statusCode).toBe(401);

      expect(res.body.success).toBe(false);

      expect(res.body.message).toBe("User not exists");
    });
  });

  describe("POST /api/auth/logout", () => {
    it("should logout user successfully", async () => {
      const res = await request(app).post("/api/auth/logout");

      expect(res.statusCode).toBe(200);

      expect(res.body.success).toBe(true);

      expect(res.body.message).toBe("User logged out successfully");
    });
  });
});
