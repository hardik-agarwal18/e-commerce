import request from "supertest";
import app from "../src/app.js";
import prisma from "../src/config/prisma.js";
import jwt from "jsonwebtoken";
import { randomUUID } from "crypto";

describe("Address API", () => {
  let authToken;
  let userId;

  const testUser = {
    name: "addressuser",
    email: "address-test@mail.com",
    password: "123456",
  };

  const testAddress = {
    fullName: "John Doe",
    phone: "1234567890",
    street: "123 Main St",
    city: "New York",
    state: "NY",
    postalCode: "10001",
    country: "USA",
  };

  beforeAll(async () => {
    await prisma.address.deleteMany();

    await prisma.user.deleteMany({
      where: {
        email: {
          in: ["address-test@mail.com", "another-address@mail.com"],
        },
      },
    });

    const signupRes = await request(app)
      .post("/api/auth/signup")
      .send(testUser);

    authToken = signupRes.body.token;

    const decoded = jwt.verify(authToken, process.env.JWT_SECRET);

    userId = decoded.user.id;
  }, 10000);

  afterAll(async () => {
    await prisma.address.deleteMany();

    await prisma.user.deleteMany({
      where: {
        email: {
          in: ["address-test@mail.com", "another-address@mail.com"],
        },
      },
    });

    await prisma.$disconnect();
  });

  describe("POST /api/user/add-address", () => {
    it("should add a new address for authenticated user", async () => {
      const res = await request(app)
        .post("/api/user/add-address")
        .set("auth-token", authToken)
        .send(testAddress);

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe("Address added successfully");

      expect(res.body.address).toBeDefined();

      expect(res.body.address.fullName).toBe(testAddress.fullName);

      expect(res.body.address.city).toBe(testAddress.city);
    });

    it("should add address with default country as India if not provided", async () => {
      const addressWithoutCountry = {
        fullName: "Jane Doe",
        phone: "0987654321",
        street: "456 Oak Ave",
        city: "Mumbai",
        state: "MH",
        postalCode: "400001",
      };

      const res = await request(app)
        .post("/api/user/add-address")
        .set("auth-token", authToken)
        .send(addressWithoutCountry);

      expect(res.statusCode).toBe(201);

      expect(res.body.success).toBe(true);

      expect(res.body.address.country).toBe("India");
    });

    it("should return error when required fields are missing", async () => {
      const incompleteAddress = {
        fullName: "John Doe",
        phone: "1234567890",
      };

      const res = await request(app)
        .post("/api/user/add-address")
        .set("auth-token", authToken)
        .send(incompleteAddress);

      expect(res.statusCode).toBe(400);

      expect(res.body.success).toBe(false);

      expect(res.body.message).toBe("All required fields must be provided");
    });

    it("should return error when user is not authenticated", async () => {
      const res = await request(app)
        .post("/api/user/add-address")
        .send(testAddress);

      expect(res.statusCode).toBe(401);
    });
  });

  describe("GET /api/user/addresses", () => {
    beforeEach(async () => {
      await prisma.address.deleteMany({
        where: {
          userId,
        },
      });

      await request(app)
        .post("/api/user/add-address")
        .set("auth-token", authToken)
        .send(testAddress);
    });

    it("should get all addresses for authenticated user", async () => {
      const res = await request(app)
        .get("/api/user/addresses")
        .set("auth-token", authToken);

      expect(res.statusCode).toBe(200);

      expect(res.body.success).toBe(true);

      expect(Array.isArray(res.body.addresses)).toBe(true);

      expect(res.body.addresses.length).toBeGreaterThan(0);
    });

    it("should return empty array when user has no addresses", async () => {
      await prisma.address.deleteMany({
        where: {
          userId,
        },
      });

      const res = await request(app)
        .get("/api/user/addresses")
        .set("auth-token", authToken);

      expect(res.statusCode).toBe(200);

      expect(res.body.success).toBe(true);

      expect(res.body.addresses).toEqual([]);
    });

    it("should return error when user is not authenticated", async () => {
      const res = await request(app).get("/api/user/addresses");

      expect(res.statusCode).toBe(401);
    });
  });

  describe("DELETE /api/user/remove-address/:id", () => {
    let addressId;

    beforeEach(async () => {
      await prisma.address.deleteMany({
        where: {
          userId,
        },
      });

      const addRes = await request(app)
        .post("/api/user/add-address")
        .set("auth-token", authToken)
        .send(testAddress);

      addressId = addRes.body.address.id;
    });

    it("should remove address successfully", async () => {
      const res = await request(app)
        .delete(`/api/user/remove-address/${addressId}`)
        .set("auth-token", authToken);

      expect(res.statusCode).toBe(200);

      expect(res.body.success).toBe(true);

      expect(res.body.message).toBe("Address removed successfully");

      const address = await prisma.address.findUnique({
        where: {
          id: addressId,
        },
      });

      expect(address).toBeNull();
    });

    it("should return error for non-existent address", async () => {
      const fakeId = randomUUID();

      const res = await request(app)
        .delete(`/api/user/remove-address/${fakeId}`)
        .set("auth-token", authToken);

      expect(res.statusCode).toBe(404);

      expect(res.body.success).toBe(false);

      expect(res.body.message).toBe("Address not found");
    });

    it("should return error when user tries to delete another user's address", async () => {
      const anotherUser = {
        name: "anotheruser",
        email: "another-address@mail.com",
        password: "123456",
      };

      const signupRes = await request(app)
        .post("/api/auth/signup")
        .send(anotherUser);

      const anotherToken = signupRes.body.token;

      const res = await request(app)
        .delete(`/api/user/remove-address/${addressId}`)
        .set("auth-token", anotherToken);

      expect(res.statusCode).toBe(403);

      expect(res.body.success).toBe(false);

      expect(res.body.message).toBe(
        "You are not authorized to delete this address",
      );
    });

    it("should return error when user is not authenticated", async () => {
      const res = await request(app).delete(
        `/api/user/remove-address/${addressId}`,
      );

      expect(res.statusCode).toBe(401);
    });
  });
});
