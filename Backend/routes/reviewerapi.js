const express = require('express');
const app = express();
const sql = require('mssql');
const { poolPromise } = require('../db/userdb'); // Same DB

// Get all reports pending review
app.get('/api/reports/review', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(
      "SELECT * FROM Reports WHERE status = 'Pending Review'"
    );
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching reports for review' });
  }
});

// Review and sign the report
app.post('/api/reports/review', async (req, res) => {
  const { reportId, reviewerName } = req.body;

  try {
    const pool = await poolPromise;

    await pool.request()
      .input('id', sql.Int, reportId)
      .input('reviewer', sql.VarChar, reviewerName)
      .input('signedAt', sql.DateTime, new Date())
      .query(`
        UPDATE Reports 
        SET status = 'Reviewed', 
            reviewer = @reviewer, 
            reviewer_signed_at = @signedAt,
            reviewerSign = 1 
        WHERE id = @id
      `);

    res.status(200).json({ message: 'Report marked as reviewed' });
  } catch (err) {
    res.status(500).json({ message: 'Error updating review' });
  }
});

module.exports = app;
