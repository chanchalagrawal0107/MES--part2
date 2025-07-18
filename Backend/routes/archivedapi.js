const express = require("express");
const fs = require("fs");
const path = require("path");
const { verifyToken, authorizeRole } = require("../routes/auth");

const router = express.Router();

const archivedFolderPath = path.join(__dirname, "../reports/approved");

router.get("/archived/files", verifyToken, authorizeRole("Approver"), async (req, res) => {
  try {
    fs.readdir(archivedFolderPath, (err, files) => {
      if (err) {
        return res.status(500).json({ error: "Failed to read archive folder" });
      }

      const pdfFiles = files.filter((file) => file.endsWith(".pdf"));
      res.json(pdfFiles); // ✅ Keep consistent response type (array)
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
