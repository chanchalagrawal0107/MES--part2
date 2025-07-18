const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const { PDFDocument, rgb } = require("pdf-lib");

// 1️⃣ Show list of files in generated/
router.get("/reports/review/files", (req, res) => {
  const folderPath = path.join(__dirname, "../reports/generated");

  fs.readdir(folderPath, (err, files) => {
    if (err) return res.status(500).json({ message: "Error reading files" });

    res.json(files);
  });
});

// 2️⃣ Serve PDF preview
router.get("/reports/review/file/:filename", (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, "../reports/generated", filename);

  if (!fs.existsSync(filePath))
    return res.status(404).json({ message: "File not found" });

  res.sendFile(filePath);
});

// 3️⃣ Sign (review) and move file to reviewed/
router.post("/reports/review/sign", async (req, res) => {
  const { filename, reviewer } = req.body;

  const oldPath = path.join(__dirname, "../reports/generated", filename);
  const newPath = path.join(__dirname, "../reports/reviewed", filename);

  if (!fs.existsSync(oldPath)) {
    return res.status(404).json({ message: "Original file not found" });
  }

  try {
    const existingPdfBytes = fs.readFileSync(oldPath);
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const pages = pdfDoc.getPages();
    const lastPage = pages[pages.length - 1];

    const date = new Date().toLocaleString();

    lastPage.drawText(`Reviewer: ${reviewer}`, {
      x: 50,
      y: 80,
      size: 10,
      color: rgb(0, 0.4, 0),
    });

    lastPage.drawText(`Reviewed on: ${date}`, {
      x: 50,
      y: 65,
      size: 8,
      color: rgb(0.2, 0.2, 0.2),
    });

    const signedPdfBytes = await pdfDoc.save();
    fs.writeFileSync(newPath, signedPdfBytes);

    fs.unlinkSync(oldPath); // delete original
    res.json({ message: "Report reviewed and moved" });
  } catch (error) {
    console.error("Error signing PDF:", error);
    res.status(500).json({ message: "Failed to sign and move report" });
  }
});

module.exports = router;
