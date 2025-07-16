const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const sql = require('mssql');
const httpntlm = require('httpntlm');
const { poolPromise } = require('../db/alarmsdb');

// POST /api/reports/generateapi
router.post("/generateapi", async (req, res) => {
  const { reportName, username, StartDate, EndDate } = req.body;

  // Validate required fields
  if (!reportName || !username || !StartDate || !EndDate) {
    return res.status(400).json({ error: "Missing required parameters." });
  }

  // Clean filename: replace + and spaces with _
  const cleanedName = reportName.replace(/\+/g, "_").replace(/ /g, "_");
  const timestamp = Date.now(); // Prevent file overwrite
  const fileName = `${cleanedName}_${timestamp}.pdf`;
  const filePath = path.join(__dirname, "../reports/generated", fileName);

  // Build SSRS report URL
  const reportPath = encodeURIComponent(`/Rockwell Project Report/${reportName}`);
  const ssrsUrl =
    `http://nitrov/ReportServer?${reportPath}` +
    `&rs:Command=Render&rs:Format=PDF` +
    `&username=${encodeURIComponent(username)}` +
    `&StartDate=${encodeURIComponent(StartDate)}` +
    `&EndDate=${encodeURIComponent(EndDate)}`;

  // NTLM auth setup
  const ntlmOptions = {
    url: ssrsUrl,
    username: "Administrator",      // ✅ Replace if needed
    password: "Rockwell1",          // ✅ Replace if needed
    domain: "NITROV",               // ✅ Replace if needed
    workstation: '',
    binary: true
  };

  httpntlm.get(ntlmOptions, async (err, response) => {
    if (err) {
      console.error("❌ NTLM request error:", err);
      return res.status(500).json({ error: "NTLM request failed." });
    }

    const contentType = response.headers['content-type'];
    if (!response.body || contentType !== 'application/pdf') {
      console.error("❌ Invalid SSRS response. Content-Type:", contentType);
      return res.status(500).json({ error: "Invalid PDF response from SSRS." });
    }

    try {
      // Convert binary response to PDF buffer
      const pdfBuffer = Buffer.from(response.body, 'binary');

      // Ensure target folder exists
      const reportsDir = path.join(__dirname, "../reports/generated");
      if (!fs.existsSync(reportsDir)) {
        fs.mkdirSync(reportsDir, { recursive: true });
      }

      // Write PDF to file
      fs.writeFileSync(filePath, pdfBuffer);
      console.log("✅ PDF saved to:", filePath);

      // Save metadata to database
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

    } catch (writeErr) {
      console.error("❌ Error writing file or saving to DB:", writeErr);
      return res.status(500).json({ error: "Failed to save report or write file." });
    }
  });
});

module.exports = router;
