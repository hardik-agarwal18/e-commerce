import mongoose from "mongoose";

const promoCodeSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      minLength: 3,
      maxLength: 20,
    },
    description: {
      type: String,
      required: true,
      maxLength: 200,
    },
    discountType: {
      type: String,
      required: true,
      enum: ["percentage", "fixed", "free_shipping"],
      default: "percentage",
    },
    discountValue: {
      type: Number,
      required: true,
      min: 0,
    },
    minimumOrderAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    maximumDiscountAmount: {
      type: Number,
      default: null, // null means no limit
      min: 0,
    },
    usageLimit: {
      type: Number,
      default: null, // null means unlimited
      min: 1,
    },
    usageCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    userUsageLimit: {
      type: Number,
      default: 1, // How many times one user can use this code
      min: 1,
    },
    usedBy: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        usageCount: {
          type: Number,
          default: 1,
          min: 1,
        },
        lastUsed: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    validFrom: {
      type: Date,
      required: true,
      default: Date.now,
    },
    validUntil: {
      type: Date,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    applicableCategories: [
      {
        type: String,
        enum: ["men", "women", "kid", "all"],
      },
    ],
    excludedProducts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    applicableProducts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    firstTimeUserOnly: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Admin user who created this promo
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient lookups
promoCodeSchema.index({ code: 1 });
promoCodeSchema.index({ isActive: 1, validFrom: 1, validUntil: 1 });
promoCodeSchema.index({ "usedBy.userId": 1 });

// Virtual to check if promo code is currently valid
promoCodeSchema.virtual("isCurrentlyValid").get(function () {
  const now = new Date();
  return (
    this.isActive &&
    this.validFrom <= now &&
    this.validUntil >= now &&
    (this.usageLimit === null || this.usageCount < this.usageLimit)
  );
});

// Method to check if a user can use this promo code
promoCodeSchema.methods.canUserUse = function (userId) {
  if (!this.isCurrentlyValid) return false;

  const userUsage = this.usedBy.find(
    (usage) => usage.userId.toString() === userId.toString()
  );

  if (!userUsage) return true;

  return userUsage.usageCount < this.userUsageLimit;
};

// Method to apply promo code usage
promoCodeSchema.methods.applyUsage = function (userId) {
  const existingUsage = this.usedBy.find(
    (usage) => usage.userId.toString() === userId.toString()
  );

  if (existingUsage) {
    existingUsage.usageCount += 1;
    existingUsage.lastUsed = new Date();
  } else {
    this.usedBy.push({
      userId: userId,
      usageCount: 1,
      lastUsed: new Date(),
    });
  }

  this.usageCount += 1;
  return this.save();
};

// Method to calculate discount amount
promoCodeSchema.methods.calculateDiscount = function (
  orderAmount,
  products = []
) {
  if (!this.isCurrentlyValid) return 0;

  // Check minimum order amount
  if (orderAmount < this.minimumOrderAmount) return 0;

  // Check category restrictions
  if (
    this.applicableCategories.length > 0 &&
    !this.applicableCategories.includes("all")
  ) {
    const hasApplicableProducts = products.some((product) =>
      this.applicableCategories.includes(product.category)
    );
    if (!hasApplicableProducts) return 0;
  }

  // Check excluded products
  if (this.excludedProducts.length > 0) {
    const hasExcludedProducts = products.some((product) =>
      this.excludedProducts.some(
        (excludedId) => excludedId.toString() === product._id.toString()
      )
    );
    if (hasExcludedProducts) return 0;
  }

  // Check applicable products (if specified, only these products are eligible)
  if (this.applicableProducts.length > 0) {
    const hasApplicableProducts = products.some((product) =>
      this.applicableProducts.some(
        (applicableId) => applicableId.toString() === product._id.toString()
      )
    );
    if (!hasApplicableProducts) return 0;
  }

  let discountAmount = 0;

  switch (this.discountType) {
    case "percentage":
      discountAmount = (orderAmount * this.discountValue) / 100;
      break;
    case "fixed":
      discountAmount = this.discountValue;
      break;
    case "free_shipping":
      // This would typically be handled in shipping calculation
      discountAmount = 0; // Or shipping cost if available
      break;
    default:
      discountAmount = 0;
  }

  // Apply maximum discount limit
  if (
    this.maximumDiscountAmount &&
    discountAmount > this.maximumDiscountAmount
  ) {
    discountAmount = this.maximumDiscountAmount;
  }

  // Ensure discount doesn't exceed order amount
  return Math.min(discountAmount, orderAmount);
};

// Static method to find valid promo codes
promoCodeSchema.statics.findValidCode = function (code) {
  const now = new Date();
  return this.findOne({
    code: code.toUpperCase(),
    isActive: true,
    validFrom: { $lte: now },
    validUntil: { $gte: now },
    $or: [
      { usageLimit: null },
      { $expr: { $lt: ["$usageCount", "$usageLimit"] } },
    ],
  });
};

// Pre-save middleware to ensure validUntil is after validFrom
promoCodeSchema.pre("save", function (next) {
  if (this.validUntil <= this.validFrom) {
    next(new Error("Valid until date must be after valid from date"));
  } else {
    next();
  }
});

// Pre-save middleware to validate discount value based on type
promoCodeSchema.pre("save", function (next) {
  if (this.discountType === "percentage" && this.discountValue > 100) {
    next(new Error("Percentage discount cannot exceed 100%"));
  } else {
    next();
  }
});

const PromoCode = mongoose.model("PromoCode", promoCodeSchema);

export default PromoCode;
