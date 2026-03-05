import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDatabase = async () => {
  try {
    // Use test database when NODE_ENV is 'test'
    const dbKey =
      process.env.NODE_ENV === "test"
        ? process.env.MONGODB_TEST_KEY
        : process.env.MONGODB_KEY;

    await mongoose.connect(dbKey);

    if (process.env.NODE_ENV === "test") {
      console.log("✅ MongoDB TEST database connected successfully.");
    } else {
      console.log("✅ MongoDB connected successfully.");
    }
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    // Don't exit process in test environment
    if (process.env.NODE_ENV !== "test") {
      process.exit(1);
    } else {
      throw error; // Let tests handle the error
    }
  }
};
export default connectDatabase;
