const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    console.log("REGISTER body:", req.body);
    const { email, password, role } = req.body;

    // validate role
    if (!["admin", "marketer"].includes(role)) {
      return res.status(400).json({ error: "Invalid role" });
    }

    // check if email already exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // create user (password will be hashed by User model pre-save hook)
    const user = new User({ email, password, role });
    await user.save();

    res.status(201).json({ message: "User created" });
  } catch (error) {
    console.error("REGISTER error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    console.log("LOGIN body:", req.body);
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: { email: user.email, role: user.role },
    });
  } catch (error) {
    console.error("LOGIN error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// optional: GET /api/auth/me
router.get("/me", async (req, res) => {
  try {
    const authHeader = req.headers.authorization || "";
    const [, token] = authHeader.split(" ");

    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.userId).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ user });
  } catch (error) {
    console.error("ME error:", error);
    res.status(401).json({ error: "Invalid token" });
  }
});

module.exports = router;
