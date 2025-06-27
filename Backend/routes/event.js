const express = require("express");
const router = express.Router();
const { sql, poolPromise } = require("../db/alarmsdb");

// GET /api/alarms
router.get("/alarms", async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query("SELECT TOP 50 * FROM AllEvent");
    res.json(result.recordset);
  } catch (err) {
    console.error("Error fetching alarms:", err.message, err.stack);

    res.status(500).json({ error: "Failed to fetch alarms" });
  }
});

module.exports = router;
