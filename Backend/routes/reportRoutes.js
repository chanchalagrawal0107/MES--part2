// const express = require("express");
// const router = express.Router();
// const axios = require("axios");
// const fs = require("fs");
// const path = require("path");
// const sql = require("mssql");
// const pool = require("../db/alarmsdb"); // Your working DB config

// router.get("/generatefromreport", async (req, res) => {
//   const { reportName, username } = req.query;

//   if (!reportName || !username) {
//     return res.status(400).send("❌ Missing report name or username.");
//   }

//   const cleanedName = reportName.replace(/\s+/g, "_");
//   const filePath = path.join(__dirname, "../reports/generated", `${cleanedName}_generated.pdf`);

//   const reportUrl = `http://nitrov/ReportServer?/Rockwell Project Report/${encodeURIComponent(reportName)}&rs:Format=PDF`;

//   console.log("📥 Fetching report from:", reportUrl);

//   try {
//     const response = await axios.get(reportUrl, {
//       responseType: "arraybuffer",
//       auth: {
//         username: "sa",
//         password: "Rockwell1",
//       },
//     });

//     fs.writeFileSync(filePath, response.data);

//     await pool.request()
//       .input("data", sql.VarChar, cleanedName)
//       .input("author", sql.VarChar, username)
//       .input("author_signed_at", sql.DateTime, new Date())
//       .input("status", sql.VarChar, "generated")
//       .query(`
//         INSERT INTO Reports (data, author, author_signed_at, status)
//         VALUES (@data, @author, @author_signed_at, @status)
//       `);

//     res.send(`<h3>✅ Report saved to /generated folder successfully.</h3>`);
//   } catch (err) {
//     console.error("❌ SSRS ERROR:", err.message);
//     res.status(500).send("❌ Failed to generate report.");
//   }
// });

// module.exports = router;

// const express = require("express");
// const router = express.Router();
// const fs = require("fs");
// const path = require("path");
// const sql = require("mssql");
// const httpntlm = require('httpntlm');
// // const axios = require("axios");
// // const axiosNTLM = require("axios-ntlm").default;
// const pool = require("../db/alarmsdb");

// // NTLM Authentication Credentials
// const ntlmConfig = {
//   username: "chira",
//   password: "8899",
//   domain: "NITROV",
//   workstation: "NitroV"
// };

// // Create axios instance with NTLM auth
// // s

// router.get("/generatefromreport", async (req, res) => {
//   const { reportName, username } = req.query;

//   if (!reportName || !username) {
//     return res.status(400).send("❌ Missing report name or username.");
//   }

//   const cleanedName = reportName.replace(/\s+/g, "_");
//   const filePath = path.join(__dirname, "../reports/generated", `${cleanedName}_generated.pdf`);
//   const reportUrl = `http://nitrov/ReportServer?/Rockwell Project Report/${encodeURIComponent(reportName)}&rs:Format=PDF`;

//   console.log("📥 Fetching report from:", reportUrl);

//   try {
//     const { body } = await httpntlm.get({
//       url: reportUrl,
//       username: 'NITROV\\chira', // Domain included
//       password: '8899',
//       workstation: 'NitroV'
//     });

//     fs.writeFileSync(filePath, body);

//     await pool.request()
//       .input("data", sql.VarChar, cleanedName)
//       .input("author", sql.VarChar, username)
//       .input("author_signed_at", sql.DateTime, new Date())
//       .input("status", sql.VarChar, "generated")
//       .query(`
//         INSERT INTO Reports (data, author, author_signed_at, status)
//         VALUES (@data, @author, @author_signed_at, @status)
//       `);

//     res.send(`<h3>✅ Report saved to /generated folder successfully.</h3>`);
//   } catch (err) {
//     console.error("❌ SSRS ERROR:", err.message);
//     res.status(500).send("❌ Failed to generate report. Error: " + err.message);
//   }
// });

// module.exports = router;



const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const { sql, poolPromise } = require("../db/alarmsdb"); // ✅ FIXED
const httpntlm = require("httpntlm");

// Configuration constants
const REPORT_SERVER_URL = "http://nitrov/ReportServer";
const REPORT_PATH = "/Rockwell Project Report";
const CREDENTIALS = {
  username: "administrator",
  password: "Rockwell1",
  workstation: "NitroV"
};

// 🔧 Wrap httpntlm.get in a Promise
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

    // 🧠 Include dynamic parameters if any
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

    const pool = await poolPromise; // ✅ FIXED
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

module.exports = router;
