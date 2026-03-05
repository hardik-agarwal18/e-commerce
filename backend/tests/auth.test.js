import request from "supertest";
import app from "../src/app.js";
import Users from "../src/models/UserModel.js";

describe("Auth API", () => {
  const testUser = {
    name: "testuser",
    email: "test@mail.com",
    password: "123456",
  };

  beforeEach(async () => {
    // Clear users collection before each test
    await Users.deleteMany({});
  });

  afterAll(async () => {
    // Clean up test data
    await Users.deleteMany({});
  });

  describe("POST /api/auth/signup", () => {
    it("should register a new user", async () => {
      const res = await request(app).post("/api/auth/signup").send(testUser);

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.token).toBeDefined();
    });

    it("should not register user with existing email", async () => {
      // Create user first
      await request(app).post("/api/auth/signup").send(testUser);

      // Try to register with same email
      const res = await request(app)
        .post("/api/auth/signup")
        .send({ ...testUser, name: "testuser2" });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("User Exists");
    });
  });

  describe("POST /api/auth/login", () => {
    beforeEach(async () => {
      // Create a test user before each login test
      await request(app).post("/api/auth/signup").send(testUser);
    });

    it("should login user with correct credentials", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({ email: testUser.email, password: testUser.password });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.token).toBeDefined();
    });

    it("should not login user with wrong password", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({ email: testUser.email, password: "wrongpassword" });

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("Wrong Password");
    });

    it("should not login user that does not exist", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({ email: "nonexistent@mail.com", password: "123456" });

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
