const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const sql = require('mssql');
const { poolPromise } = require('../db/alarmsdb');

// POST /api/reports/generateapi
router.post("/generateapi", async (req, res) => {
  const { reportName, username, StartDate, EndDate } = req.body;

  // Validate required fields
  if (!reportName || !username || !StartDate || !EndDate) {
    return res.status(400).json({ error: "Missing required parameters." });
  }

  try {
    // Clean and prepare file name
    const cleanedName = reportName.replace(/\+/g, "_").replace(/ /g, "_");
    const timestamp = Date.now();
    const fileName = `${cleanedName}_${timestamp}.pdf`;

    // Define folder and file path
    const reportsDir = path.join(__dirname, "../reports/generated");
    const filePath = path.join(reportsDir, fileName);

    // Ensure directory exists
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }

    // For now, just create a placeholder PDF file (dummy content)
    fs.writeFileSync(filePath, "This is a dummy PDF content for report generation.");

    // Save metadata to DB
    const pool = await poolPromise;
    await pool.request()
      .input("data", sql.VarChar, fileName)
      .input("author", sql.VarChar, username)
      .input("author_signed_at", sql.DateTime, new Date())
      .input("status", sql.VarChar, "generated")
      .query(`
        INSERT INTO Reports (data, author, author_signed_at, status)
        VALUES (@data, @author, @author_signed_at, @status)
      `);

    return res.status(200).json({
      message: "✅ Report generated and saved successfully.",
      path: `/reports/generated/${fileName}`
    });

  } catch (err) {
    console.error("❌ Error generating report:", err);
    return res.status(500).json({ error: "Failed to generate report." });
  }
});

module.exports = router;
