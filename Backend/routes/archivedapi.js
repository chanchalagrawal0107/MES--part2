const express = require("express");
const fs = require("fs");
const path = require("path");
const { verifyToken, authorizeRole } = require("../routes/auth");

const router = express.Router();

const archivedFolderPath = path.join(__dirname, "../reports/approved");

router.get("/files", verifyToken, authorizeRole("Approver"), async (req, res) => {
  try {
    fs.readdir(archivedFolderPath, (err, files) => {
      if (err) {
        console.log("❌ Failed to read folder:", err);
        return res.status(500).json({ error: "Failed to read archive folder" });
      }

      const pdfFiles = files.filter((file) => file.toLowerCase().endsWith(".pdf"));
      console.log("📁 Archived files found:", pdfFiles); // ✅
      res.json(pdfFiles);
    });
  } catch (err) {
    console.error("❌ Server error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
