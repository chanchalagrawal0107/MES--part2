const express = require('express');
const router = express.Router();
const sql = require('mssql');
const { poolPromise } = require('../db/assetcentre_db'); // Make sure this is your assetcentre DB

// GET /api/assetcentre
router.get('/assetcentre', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT TOP 100 * FROM log_AuditEventLog');
    res.json(result.recordset);
  } catch (err) {
    console.error("Error fetching AssetCentre:", err.message, err.stack);

    res.status(500).json({ error: 'Failed to fetch audit report' });
  }
});

module.exports = router;
