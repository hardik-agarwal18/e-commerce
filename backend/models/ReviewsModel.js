import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    productId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "Product",
    },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);
const Reviews = mongoose.model("Reviews", reviewSchema);

export default Reviews;
