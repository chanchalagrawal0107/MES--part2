const express = require('express');
const router = express.Router();
const sql = require('mssql');
const { poolPromise } = require('../db/alarmsdb'); // Or the DB you’re using

// Create report (Author)
router.post('/reports/create', async (req, res) => {
  const { id, data, createdBy } = req.body;

  try {
    const pool = await poolPromise;

    await pool.request()
      .input('id', sql.VarChar, id)
      .input('data', sql.Text, data)
      .input('status', sql.VarChar, 'Pending Review')
      .input('author', sql.VarChar, author)
      .input('author_signed_at', sql.DateTime, new Date())
      .query(`
        INSERT INTO Reports (data, author, author_signed_at, status)
        VALUES (@data, @author, @author_signed_at, @status)
      `);

    res.status(200).json({ message: 'Report created and submitted for review' });
  } catch (err) {
    console.error('Error creating report:', err);
    res.status(500).json({ message: 'Failed to create report' });
  }
});

module.exports = router;
