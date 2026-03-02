import rateLimit from "express-rate-limit";

// Helper to disable rate limiting in test environment
const createRateLimiter = (options) => {
  if (process.env.NODE_ENV === "test") {
    // Return a no-op middleware that just calls next()
    return (req, res, next) => next();
  }
  return rateLimit(options);
};

// Global rate limiter
export const globalLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests, try again later.",
});

// Login limiter
export const loginLimiter = createRateLimiter({
  windowMs: 10 * 60 * 1000,
  max: 5,
  message: "Too many login attempts. Please try again later.",
});

// Signup limiter
export const signupLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000,
  max: 3,
  message: "Too many signup attempts. Try again after an hour.",
});
