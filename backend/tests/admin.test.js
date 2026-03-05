import request from "supertest";
import app from "../src/app.js";
import Users from "../src/models/UserModel.js";

describe("Admin API", () => {
  const adminUser = {
    name: "admin",
    email: "admin@example.com",
    password: "admin123",
    role: "admin",
  };

  beforeAll(() => {
    // Set admin credentials in environment variables for testing
    process.env.ADMIN_EMAIL = adminUser.email;
    process.env.ADMIN_PASSWORD = adminUser.password;
  });

  beforeEach(async () => {
    // Clear users collection before each test
    await Users.deleteMany({});
  });

  afterAll(async () => {
    // Clean up test data
    await Users.deleteMany({});
  });

  describe("POST /api/admin/login", () => {
    it("should return token for valid admin credentials", async () => {
      const res = await request(app)
        .post("/api/admin/login")
        .send({ email: adminUser.email, password: adminUser.password });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.token).toBeDefined();
      expect(typeof res.body.token).toBe("string");
    });

    it("should return error for invalid email", async () => {
      const res = await request(app)
        .post("/api/admin/login")
        .send({ email: "wrong@example.com", password: adminUser.password });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.errors).toBe("Invalid Credentials");
    });

    it("should return error for invalid password", async () => {
      const res = await request(app)
        .post("/api/admin/login")
        .send({ email: adminUser.email, password: "wrongpassword" });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.errors).toBe("Invalid Credentials");
    });

    it("should return error for missing credentials", async () => {
      const res = await request(app).post("/api/admin/login").send({});

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.errors).toBe("Invalid Credentials");
    });
  });

  describe("POST /api/admin/logout", () => {
    it("should logout admin successfully", async () => {
      const res = await request(app).post("/api/admin/logout");

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe("Admin logged out successfully");
    });
  });
});
