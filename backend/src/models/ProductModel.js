import mongoose from "mongoose";

const Product = mongoose.model("Product", {
  id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  new_price: {
    type: Number,
    required: true,
  },
  old_price: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  stock: { type: Number, required: false, default: 0 }, // Keep for backward compatibility
  sizeStock: {
    type: Map,
    of: Number,
    default: () =>
      new Map([
        ["S", 0],
        ["M", 0],
        ["L", 0],
        ["XL", 0],
        ["XXL", 0],
      ]),
  },
  available: {
    type: Boolean,
    default: true,
  },
});

export default Product;
