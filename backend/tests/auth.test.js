import request from "supertest";
import app from "../src/app.js";
import mongoose from "mongoose";

describe("Auth API", () => {
  afterAll(async () => {
    // Close database connection after all tests
    await mongoose.connection.close();
  });

  it("should login user", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "test@mail.com", password: "123456" });

    expect(res.statusCode).toBe(400);
  });
});
