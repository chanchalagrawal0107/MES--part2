const express = require("express");
const router = express.Router();
const ntlm = require("httpntlm");

// SSRS Configuration
const SSRS_REST_URL = "http://nitrov/Reports/api/v2.0";
const username = "chira"; 
const password = "8899"; 
const domain = "NITROV"; 

// 🟡 1. List all reports
router.get("/ssrs/reports", async (req, res) => {
    ntlm.get({
        url:`${SSRS_REST_URL}/Reports`,
        username,
        password,
        domain,
        workstation:'',
        headers:{
            Accept:"application/json"
        }
    })
  try {
    const response = await axios.get(`${SSRS_REST_URL}/Reports`, {
      auth: {
        username: SSRS_USER,
        password: SSRS_PASS,
      },
    });

    const filteredReports = response.data.value.filter(item => !item.IsFolder);

    const reports = filteredReports.map(item => ({
      id: item.Id,
      name: item.Name,
      path: item.Path,
    }));

    res.json(reports);
  } catch (err) {
    console.error("Error getting report list:", err);
    res.status(500).json({ error: "Failed to get report list" });
  }
});

// 🟢 2. Render a report as PDF
router.get("/ssrs/render-report", async (req, res) => {
  const { path } = req.query;

  if (!path) {
    return res.status(400).json({ error: "Missing report path" });
  }

  const encodedPath = encodeURIComponent(path);
  const reportUrl = `${REPORTSERVER_URL}?${encodedPath}&rs:Format=PDF&rs:Command=Render`;

  try {
    const response = await axios.get(reportUrl, {
      responseType: "arraybuffer",
      auth: {
        username: SSRS_USER,
        password: SSRS_PASS,
      },
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'inline; filename="report.pdf"');
    res.send(response.data);
  } catch (err) {
    console.error("Error rendering report:", err.message);
    res.status(500).json({ error: "Failed to render report" });
  }
});

module.exports = router;
