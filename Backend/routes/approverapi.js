const express = require('express');
const app = express();
const sql = require('mssql');
const { poolPromise } = require('../db/alarmsdb');

// Get all reports ready for approval
app.get('/api/reports/approve', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(
      "SELECT * FROM Reports WHERE status = 'Reviewed'"
    );
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching reports for approval' });
  }
});

// Approve and sign
app.post('/api/reports/approve', async (req, res) => {
  const { id, approver } = req.body;

  try {
    const pool = await poolPromise;

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

    res.status(200).json({ message: 'Report approved successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error approving report' });
  }
});

module.exports = app;
