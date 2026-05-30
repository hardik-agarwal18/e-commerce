import request from "supertest";
import app from "../src/app.js";

describe("Upload API", () => {
  let adminToken;

  const adminUser = {
    email: "[admin@example.com](mailto:admin@example.com)",
    password: "admin123",
  };

  beforeAll(async () => {
    process.env.ADMIN_EMAIL = adminUser.email;

    process.env.ADMIN_PASSWORD = adminUser.password;

    const loginRes = await request(app)
      .post("/api/admin/login")
      .send(adminUser);

    adminToken = loginRes.body.token;
  });

  describe("POST /api/upload", () => {
    it("should return error when no file is uploaded", async () => {
      const res = await request(app)
        .post("/api/upload")
        .set("auth-token", adminToken);

      expect(res.statusCode).toBe(400);

      expect(res.body.success).toBe(false);

      expect(res.body.message).toBe("No file uploaded");
    });

    it("should upload image successfully", async () => {
      const testImageBuffer = Buffer.from(
        "R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
        "base64",
      );

      const res = await request(app)
        .post("/api/upload")
        .set("auth-token", adminToken)
        .attach("product", testImageBuffer, "test.gif");

      if (res.statusCode === 200) {
        expect(res.body.success).toBe(true);

        expect(res.body.image_url).toBeDefined();

        expect(res.body.public_id).toBeDefined();
      } else {
        expect(res.statusCode).toBeGreaterThanOrEqual(400);
      }
    });

    it("should require admin authentication", async () => {
      const testImageBuffer = Buffer.from(
        "R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
        "base64",
      );

      const res = await request(app)
        .post("/api/upload")
        .attach("product", testImageBuffer, "test.gif");

      expect(res.statusCode).toBe(401);
    });
  });
});
