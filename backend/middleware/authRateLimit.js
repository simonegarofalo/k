// Rate liming (login and register form)
const rateLimit = require("express-rate-limit");

const authRateLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Too many attempts. Please try again later.",
  },
});

module.exports = authRateLimiter;

