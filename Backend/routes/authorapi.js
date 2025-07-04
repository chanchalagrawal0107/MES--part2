const express = require('express');
const router = express.Router();
const sql = require('mssql');
const { poolPromise } = require('../db/userdb'); // Or the DB you’re using

// Create report (Author)
router.post('/reports/create', async (req, res) => {
  const { title, content, createdBy } = req.body;

  try {
    const pool = await poolPromise;

    await pool.request()
      .input('title', sql.VarChar, title)
      .input('content', sql.Text, content)
      .input('createdBy', sql.VarChar, createdBy)
      .input('status', sql.VarChar, 'Pending Review')
      .input('author', sql.VarChar, createdBy)
      .input('author_signed_at', sql.DateTime, new Date())
      .query(`
        INSERT INTO Reports (data, author, author_signed_at, status)
        VALUES (@content, @author, @author_signed_at, @status)
      `);

    res.status(200).json({ message: 'Report created and submitted for review' });
  } catch (err) {
    console.error('Error creating report:', err);
    res.status(500).json({ message: 'Failed to create report' });
  }
});

module.exports = router;
