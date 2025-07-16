const express = require('express');
const router = express.Router();
const sql = require('mssql');
const multer = require('multer');
const path = require('path');
const { poolPromise } = require('../db/alarmsdb');

// Storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../reports/generated'));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '_' + file.originalname);
  },
});
const upload = multer({ storage });

// POST /api/reports/generate (Author upload + sign)
router.post('/generate', upload.single('file'), async (req, res) => {
  const { data, username } = req.body;
  const file = req.file;

  if (!data || !file) {
    return res.status(400).json({ error: 'Missing report name or file' });
  }

  try {
    const pool = await poolPromise;

    await pool.request()
      .input('report_name', sql.VarChar, data)
      .input('file_path', sql.VarChar, file.filename)
      .input('author', sql.VarChar, username)
      .input('author_signed_at', sql.DateTime, new Date())
      .input('status', sql.VarChar, 'Pending Review')
      .input('authorSign', sql.Bit, 1)
      .query(`
        INSERT INTO Reports (report_name, file_path, author, author_signed_at, status, authorSign)
        VALUES (@report_name, @file_path, @author,
        @author_signed_at, @status, @authorSign)
      `);

    res.status(200).json({ message: 'Report submitted successfully' });
  } catch (err) {
    console.error('Error saving report:', err);
    res.status(500).json({ error: 'Failed to save report' });
  }
});

module.exports = router;
