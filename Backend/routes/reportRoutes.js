const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const { sql, poolPromise } = require("../db/alarmsdb");
const httpntlm = require("httpntlm");
const { checkRole } = require("../middleware/role");
const { verifyToken, authorizeRole } = require('../routes/auth');

const REPORT_SERVER_URL = "http://nitrov/ReportServer";
const REPORT_PATH = "/Rockwell Project Report";
const CREDENTIALS = {
  username: "administrator",
  password: "Rockwell1",
  workstation: "NitroV"
};

function ntlmGetAsync(options) {
  return new Promise((resolve, reject) => {
    httpntlm.get(options, (err, res) => {
      if (err) return reject(err);
      resolve(res);
    });
  });
}

router.get("/generatefromreport", async (req, res) => {
  try {
    const { reportName, username, ...params } = req.query;

    if (!reportName || !username) {
      return res.status(400).send("❌ Missing report name or username.");
    }

    const cleanedName = reportName.replace(/\s+/g, "_");
    const timestamp = Date.now();
    const filePath = path.join(__dirname, "../reports/generated", `${cleanedName}_${timestamp}_generated.pdf`);

    const paramQueryString = Object.entries(params)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join("&");

    const reportUrl = `${REPORT_SERVER_URL}?${REPORT_PATH}/${encodeURIComponent(reportName)}&rs:Format=PDF${paramQueryString ? "&" + paramQueryString : ""}`;

    console.log("📥 Fetching report from:", reportUrl);

    const ntlmResponse = await ntlmGetAsync({
      url: reportUrl,
      username: CREDENTIALS.username,
      password: CREDENTIALS.password,
      workstation: CREDENTIALS.workstation,
      domain: "NITROV"
    });

    fs.writeFileSync(filePath, ntlmResponse.body);

    const pool = await poolPromise;
    await pool.request()
      .input("data", sql.VarChar, cleanedName)
      .input("author", sql.VarChar, username)
      .input("author_signed_at", sql.DateTime, new Date())
      .input("status", sql.VarChar, "generated")
      .query(`
        INSERT INTO Reports (data, author, author_signed_at, status)
        VALUES (@data, @author, @author_signed_at, @status)
      `);

    res.send(`<h3>✅ Report saved to /generated folder successfully.</h3>`);
  } catch (err) {
    console.error("❌ SSRS ERROR:", err.message);
    res.status(500).send(`❌ Failed to generate report. Error: ${err.message}`);
  }
});

router.get('/files/reviewer', checkRole('Reviewer'), async (req, res) => {
  const dirPath = path.join(__dirname, '../reports/generated');
  const files = fs.readdirSync(dirPath);
  res.json({ files });
});

router.post('/sign', checkRole('Reviewer'), async (req, res) => {
  const { filename, username } = req.body;
  const src = path.join(__dirname, '../reports/generated', filename);
  const dest = path.join(__dirname, '../reports/reviewed', filename.replace('generated', 'reviewed'));
  fs.renameSync(src, dest);
  res.json({ message: `✅ Signed by Reviewer ${username} and moved.` });
});

router.get('/files/approver', checkRole('Approver'), async (req, res) => {
  const dirPath = path.join(__dirname, '../reports/reviewed');
  const files = fs.readdirSync(dirPath);
  res.json({ files });
});

router.post('/approve', checkRole('Approver'), async (req, res) => {
  const { filename, username } = req.body;
  const src = path.join(__dirname, '../reports/reviewed', filename);
  const dest = path.join(__dirname, '../reports/approved', filename.replace('reviewed', 'approved'));
  fs.renameSync(src, dest);
  res.json({ message: `✅ Approved by ${username} and moved.` });
});

// 🔥 Removed the /archived/files route to avoid duplication

module.exports = router;

