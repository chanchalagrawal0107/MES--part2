const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

// 1️⃣ Show list of files in generated/
router.get("/reports/review/files", (req, res) => {
  const folderPath = path.join(__dirname, "../reports/generated");

  fs.readdir(folderPath, (err, files) => {
    if (err) return res.status(500).json({ message: "Error reading files" });

    res.json(files); // filenames
  });
});

// 2️⃣ Serve PDF preview
router.get("/reports/review/file/:filename", (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, "../reports/generated", filename);
  if (!fs.existsSync(filePath)) return res.status(404).json({ message: "File not found" });

  res.sendFile(filePath);
});

// 3️⃣ Sign (move) file to reviewed/
router.post("/reports/review/sign", (req, res) => {
  const { filename, reviewer } = req.body;
  const oldPath = path.join(__dirname, "../reports/generated", filename);
  const newPath = path.join(__dirname, "../reports/reviewed", filename);

  if (!fs.existsSync(oldPath)) return res.status(404).json({ message: "Original file not found" });

  fs.rename(oldPath, newPath, (err) => {
    if (err) return res.status(500).json({ message: "Failed to sign report" });
    res.json({ message: "Report reviewed and moved" });
  });
});

module.exports = router;
