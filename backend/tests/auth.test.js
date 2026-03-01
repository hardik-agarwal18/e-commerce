import request from "supertest";
import app from "../src/app.js";
import mongoose from "mongoose";

describe("Auth API", () => {
  afterAll(async () => {
    // Close database connection after all tests
    await mongoose.connection.close();
  });

  it("should register user", async () => {
    const res = await request(app).post("/api/auth/signup").send({
      name: "testuser",
      email: "test@mail.com",
      password: "123456",
    });
    expect(res.statusCode).toBe(201);
  });

  it("should not register user with existing email", async () => {
    const res = await request(app).post("/api/auth/signup").send({
      name: "testuser2",
      email: "test@mail.com",
      password: "1234567",
    });
    expect(res.statusCode).toBe(400);
  });

  it("should login user", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "test@mail.com", password: "123456" });

    expect(res.statusCode).toBe(200);
  });

  it("should not login user with wrong credentials", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "test@mail.com", password: "wrongpassword" });

    expect(res.statusCode).toBe(401);
  });

  it("should not login user because user does not exist", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "nonexistent@mail.com", password: "123456" });

    expect(res.statusCode).toBe(401);
  });

  it("should logout user", async () => {
    const res = await request(app).post("/api/auth/logout");

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("User logged out successfully");
  });
});
