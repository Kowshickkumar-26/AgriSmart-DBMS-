import { Router } from "express";
import { pool } from "../db.js";
import { authRequired } from "../middleware/auth.js";

const router = Router();

const TABLES = ["farms", "fields", "crops", "sensors", "harvests"];
const isValidTable = (t) => TABLES.includes(t) ? t : null;

/* =====================================================
   SEARCH ROUTE
   ===================================================== */
router.get("/:table/search", authRequired, async (req, res) => {
  try {
    const table = isValidTable(req.params.table);
    if (!table) return res.status(404).json({ message: "Invalid table" });

    const q = (req.query.q || "").toLowerCase();

    const [rows] = await pool.query(
      `SELECT id, name, details
       FROM ${table}
       WHERE user_id = ? AND LOWER(name) LIKE ?
       ORDER BY id ASC`,
      [req.user.id, `%${q}%`]
    );

    res.json(rows);
  } catch (err) {
    console.error("SEARCH error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* =====================================================
   READ ALL
   ===================================================== */
router.get("/:table", authRequired, async (req, res) => {
  try {
    const table = isValidTable(req.params.table);
    if (!table) return res.status(404).json({ message: "Invalid table" });

    const [rows] = await pool.query(
      `SELECT id, name, details
       FROM ${table}
       WHERE user_id = ?
       ORDER BY id ASC`,
      [req.user.id]
    );

    res.json(rows);
  } catch (err) {
    console.error("GET error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* =====================================================
   CREATE
   ===================================================== */
router.post("/:table", authRequired, async (req, res) => {
  try {
    const table = isValidTable(req.params.table);
    if (!table) return res.status(404).json({ message: "Invalid table" });

    const { name, details } = req.body;
    if (!name || name.trim() === "")
      return res.status(400).json({ message: "Name required" });

    const [result] = await pool.query(
      `INSERT INTO ${table} (user_id, name, details)
       VALUES (?, ?, ?)`,
      [req.user.id, name.trim(), details || ""]
    );

    res.json({ message: "Created", id: result.insertId });
  } catch (err) {
    console.error("POST error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* =====================================================
   UPDATE — FIXED VERSION
   ===================================================== */
router.put("/:table/:id", authRequired, async (req, res) => {
  try {
    const table = isValidTable(req.params.table);
    if (!table) return res.status(404).json({ message: "Invalid table" });

    const { id } = req.params;
    let { name, details } = req.body;

    const fields = [];
    const values = [];

    // FIX: allow blank string but ignore undefined fields
    if (name !== undefined) {
      if (name.trim() === "")
        return res.status(400).json({ message: "Name cannot be empty" });

      fields.push("name = ?");
      values.push(name.trim());
    }

    if (details !== undefined) {
      fields.push("details = ?");
      values.push(details || "");
    }

    if (fields.length === 0)
      return res.status(400).json({ message: "Nothing to update" });

    values.push(req.user.id, id);

    const [result] = await pool.query(
      `UPDATE ${table} SET ${fields.join(", ")}
       WHERE user_id = ? AND id = ?`,
      values
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Record not found" });

    res.json({ message: "Updated" });
  } catch (err) {
    console.error("PUT error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* =====================================================
   DELETE
   ===================================================== */
router.delete("/:table/:id", authRequired, async (req, res) => {
  try {
    const table = isValidTable(req.params.table);
    if (!table) return res.status(404).json({ message: "Invalid table" });

    const { id } = req.params;

    const [result] = await pool.query(
      `DELETE FROM ${table}
       WHERE user_id = ? AND id = ?`,
      [req.user.id, id]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Record not found" });

    res.json({ message: "Deleted" });
  } catch (err) {
    console.error("DELETE error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
