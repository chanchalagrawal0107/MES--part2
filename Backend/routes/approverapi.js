const express = require('express');
const router = express.Router();
const sql = require('mssql');
const { poolPromise } = require('../db/alarmsdb');

// GET /api/reports/approve
router.get('/approve', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(
      "SELECT * FROM Reports WHERE status = 'Reviewed'"
    );
    res.json(result.recordset);
  } catch (err) {
    console.error("Error fetching approval reports:", err);
    res.status(500).json({ error: 'Failed to fetch approval reports' });
  }
});

// POST /api/reports/approve
router.post('/reports/approve', async (req, res) => {
  const { id, approver } = req.body;

  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT filepath FROM Reports WHERE id = @id');

    const oldPath = path.join(__dirname, '../reports/reviewed', result.recordset[0].filepath);
    const newPath = path.join(__dirname, '../reports/approved', result.recordset[0].filepath);

    fs.renameSync(oldPath, newPath);

    await pool.request()
      .input('id', sql.Int, id)
      .input('approver', sql.VarChar, approver)
      .input('approver_signed_at', sql.DateTime, new Date())
      .query(`
        UPDATE Reports 
        SET status = 'Approved', 
            approver = @approver, 
            approver_signed_at = @approver_signed_at,
            approverSign = 1 
        WHERE id = @id
      `);

    res.status(200).json({ message: 'Report approved and moved to approved folder' });
  } catch (err) {
    console.error('Approver error:', err);
    res.status(500).json({ message: 'Error approving report' });
  }
});


module.exports = router;
