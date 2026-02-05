const express = require("express");
const bcrypt = require("bcrypt");
const pool = require("../db.js");
const router = express.Router();

const validateAuthInput = require("../utils/validateAuthInput.js");
const authRateLimiter = require("../middleware/authRateLimit");

// User registration
router.post("/register", authRateLimiter, async (req, res) => {
  const { email, password } = req.body;

  const { valid, errors } = validateAuthInput({ email, password }, "register");

  if (!valid) {
    return res.status(400).json({
      error: Object.values(errors)[0],});  
  }

  try {
    // Check if the user already exists
    const existing = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );

    if (existing.rows.length > 0) {
      return res.status(409).json({ error: "User already exists" });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Save the user into db
    const result = await pool.query(
      "INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id",
      [email, passwordHash]
    );

    // Create new session
    req.session.userId = result.rows[0].id;

    res.status(201).json({ 
      success: true,
      user: result.rows[0],
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Registration failed" });
  }
});

// User login
router.post("/login", authRateLimiter, async (req, res) => {
  const { email, password } = req.body;

  const { valid, errors } = validateAuthInput({ email, password }, "login");

  if (!valid) {
    return res.status(400).json({
      error: Object.values(errors)[0],
    });
  }

  try {
    const result = await pool.query(
      "SELECT id, email, password_hash FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = result.rows[0];

    const isValid = await bcrypt.compare(password, user.password_hash);

    if (!isValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    req.session.userId = user.id;

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
      },
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Login failed" });
  }
});

// Endopoint user logged
router.get("/me", async (req, res) => {
  // Check the status of the session
  if (!req.session.userId) {
    return res.json({ authenticated: false });
  }

  try {
    // Catch user data from db 
    const result = await pool.query(
      "SELECT id, email FROM users WHERE id = $1",
      [req.session.userId]
    );

    if (result.rows.length === 0) {
      return res.json({ authenticated: false });
    }

    res.json({
      authenticated: true,
      user: result.rows[0],
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// User logout
router.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("kangaroo.sid");
    res.json({ success: true });
  });
});



module.exports = router;

