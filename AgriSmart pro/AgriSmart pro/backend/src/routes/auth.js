import { Router } from "express";
import { pool } from "../db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = Router();

// POST /api/auth/signup
router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body || {};
    if (!username || !email || !password) {
      return res.status(400).json({ message: "username, email, password required" });
    }

    // Check duplicates
    const [exists] = await pool.query(
      "SELECT id FROM users WHERE username=? OR email=? LIMIT 1",
      [username, email]
    );
    if (exists.length) return res.status(409).json({ message: "Username or email already exists" });

    // Create
    const hash = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      "INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)",
      [username, email, hash]
    );

    return res.status(201).json({ message: "Signup successful", userId: result.insertId });
  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body || {};
    if (!username || !password) {
      return res.status(400).json({ message: "username and password required" });
    }

    const [rows] = await pool.query("SELECT * FROM users WHERE username=? LIMIT 1", [username]);
    if (!rows.length) return res.status(401).json({ message: "Invalid credentials" });

    const user = rows[0];
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "2d" }
    );

    return res.json({ message: "Login successful", token });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;
