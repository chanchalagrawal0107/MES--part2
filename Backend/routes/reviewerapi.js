const express = require('express');
const router = express.Router();
const sql = require('mssql');
const { poolPromise } = require('../db/alarmsdb'); // Same DB

// ✅ Get all reports pending review
router.get('/reports/review', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(
      "SELECT * FROM Reports WHERE status = 'Pending Review'"
    );
    res.json(result.recordset);
  } catch (err) {
    console.error('Error fetching reports:', err);
    res.status(500).json({ message: 'Error fetching reports for review' });
  }
});

// ✅ Review and sign the report
router.post('/reports/review', async (req, res) => {
  const { reportId, reviewerName } = req.body;

  try {
    const pool = await poolPromise;

    await pool.request()
      .input('id', sql.Int, reportId)
      .input('reviewer', sql.VarChar, reviewerName)  // Corrected here
      .input('reviewer_signed_at', sql.DateTime, new Date())
      .query(`
        UPDATE Reports 
        SET status = 'Reviewed', 
            reviewer = @reviewer, 
            reviewer_signed_at = @reviewer_signed_at,
            reviewerSign = 1 
        WHERE id = @id
      `);

    res.status(200).json({ message: 'Report marked as reviewed' });
  } catch (err) {
    console.error('Error updating review:', err);
    res.status(500).json({ message: 'Error updating review' });
  }
});

module.exports = router;
