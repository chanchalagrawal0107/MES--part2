const express = require('express');
const router = express.Router();
const sql = require('mssql');
const { poolPromise } = require('../db/alarmsdb');

// GET /api/reports/review (Pending review reports)
router.get('/review', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(
      "SELECT * FROM Reports WHERE status = 'Pending Review'"
    );
    res.json(result.recordset);
  } catch (err) {
    console.error('Error fetching review reports:', err);
    res.status(500).json({ error: 'Failed to fetch review reports' });
  }
});

// POST /api/reports/review (Sign as reviewer)
router.post('/reports/review', async (req, res) => {
  const { reportId, reviewerName } = req.body;

  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', sql.Int, reportId)
      .query('SELECT filepath FROM Reports WHERE id = @id');

    const oldPath = path.join(__dirname, '../reports/generated', result.recordset[0].filepath);
    const newPath = path.join(__dirname, '../reports/reviewed', result.recordset[0].filepath);

    fs.renameSync(oldPath, newPath);

    await pool.request()
      .input('id', sql.Int, reportId)
      .input('reviewer', sql.VarChar, reviewerName)
      .input('reviewer_signed_at', sql.DateTime, new Date())
      .query(`
        UPDATE Reports 
        SET status = 'Reviewed', 
            reviewer = @reviewer, 
            reviewer_signed_at = @reviewer_signed_at,
            reviewerSign = 1 
        WHERE id = @id
      `);

    res.status(200).json({ message: 'Report reviewed and moved to reviewed folder' });
  } catch (err) {
    console.error('Reviewer error:', err);
    res.status(500).json({ message: 'Error reviewing report' });
  }
});


module.exports = router;
