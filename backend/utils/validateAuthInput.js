function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateAuthInput({ email, password }, mode) {
  const errors = {};

  // Email validation
  if (!email || typeof email !== "string") {
    errors.email = "Email is required";
  } else if (!isValidEmail(email.trim())) {
    errors.email = "Invalid email format";
  }

  // Password (common rules) validation
  if (!password || typeof password !== "string") {
    errors.password = "Password is required";
  }

  // Register-only rules
  if (mode === "register" && password && password.length < 8) {
    errors.password = "Password must be at least 8 characters";
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

module.exports = validateAuthInput;

