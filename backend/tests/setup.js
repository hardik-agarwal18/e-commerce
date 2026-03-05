import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

// Set up before all tests
beforeAll(async () => {
  try {
    const dbKey = process.env.MONGODB_TEST_KEY;
    if (!dbKey) {
      throw new Error("MONGODB_TEST_KEY environment variable is not set");
    }
    await mongoose.connect(dbKey);
    console.log("✅ Test database connected");
  } catch (error) {
    console.error("❌ Test database connection failed:", error.message);
    throw error;
  }
});

// Clean up after all tests
afterAll(async () => {
  try {
    await mongoose.connection.close();
    console.log("✅ Test database connection closed");
  } catch (error) {
    console.error("❌ Error closing test database:", error.message);
  }
});
