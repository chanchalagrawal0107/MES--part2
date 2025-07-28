const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const { sql, poolPromise } = require("../db/alarmsdb");
const { checkRole } = require("../middleware/role");

// Reviewer: View generated reports
router.get('/files/reviewer', checkRole('Reviewer'), async (req, res) => {
  const dirPath = path.join(__dirname, '../reports/generated');
  const files = fs.readdirSync(dirPath);
  res.json({ files });
});

// Reviewer: Sign and move report to reviewed folder
router.post('/sign', checkRole('Reviewer'), async (req, res) => {
  const { filename, username } = req.body;
  const src = path.join(__dirname, '../reports/generated', filename);
  const dest = path.join(__dirname, '../reports/reviewed', filename.replace('generated', 'reviewed'));

  try {
    fs.renameSync(src, dest);

    const pool = await poolPromise;
    await pool.request()
      .input("data", sql.VarChar, filename)
      .input("reviewer", sql.VarChar, username)
      .input("reviewer_signed_at", sql.DateTime, new Date())
      .query(`
        UPDATE Reports
        SET reviewer = @reviewer, reviewer_signed_at = @reviewer_signed_at, status = 'reviewed'
        WHERE data = @data
      `);

    res.json({ message: `✅ Signed by Reviewer ${username} and moved.` });
  } catch (err) {
    console.error("❌ Error signing report:", err.message);
    res.status(500).json({ error: "Failed to sign report." });
  }
});

// Approver: View reviewed reports
router.get('/files/approver', checkRole('Approver'), async (req, res) => {
  const dirPath = path.join(__dirname, '../reports/reviewed');
  const files = fs.readdirSync(dirPath);
  res.json({ files });
});

// Approver: Approve and move report to approved folder
router.post('/approve', checkRole('Approver'), async (req, res) => {
  const { filename, username } = req.body;
  const src = path.join(__dirname, '../reports/reviewed', filename);
  const dest = path.join(__dirname, '../reports/approved', filename.replace('reviewed', 'approved'));

  try {
    fs.renameSync(src, dest);

    const pool = await poolPromise;
    await pool.request()
      .input("data", sql.VarChar, filename)
      .input("approver", sql.VarChar, username)
      .input("approved_at", sql.DateTime, new Date())
      .query(`
        UPDATE Reports
        SET approver = @approver, approved_at = @approved_at, status = 'approved'
        WHERE data = @data
      `);

    res.json({ message: `✅ Approved by ${username} and moved.` });
  } catch (err) {
    console.error("❌ Error approving report:", err.message);
    res.status(500).json({ error: "Failed to approve report." });
  }
});

module.exports = router;
