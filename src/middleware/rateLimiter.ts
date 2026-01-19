import { rateLimit } from "express-rate-limit";

// rateLimiter defines a generic rate limiter for use in this application for all routes.
export const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
});
