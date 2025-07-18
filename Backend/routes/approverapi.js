const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const { checkRole } = require("../middleware/role");
const { PDFDocument, rgb } = require("pdf-lib");

// 1️⃣ List reviewed files
router.get("/approve/files", checkRole("Approver"), (req, res) => {
  const folderPath = path.join(__dirname, "../reports/reviewed");

  fs.readdir(folderPath, (err, files) => {
    if (err) return res.status(500).json({ message: "Error reading files" });
    res.json(files);
  });
});

// 2️⃣ Serve PDF preview
router.get("/approve/file/:filename", checkRole("Approver"), (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, "../reports/reviewed", filename);

  if (!fs.existsSync(filePath))
    return res.status(404).json({ message: "File not found" });

  res.sendFile(filePath);
});

// 3️⃣ Approve and move to approved/
router.post("/approve/sign", checkRole("Approver"), async (req, res) => {
  const { filename, approver } = req.body;

  const oldPath = path.join(__dirname, "../reports/reviewed", filename);
  const newPath = path.join(__dirname, "../reports/approved", filename);

  if (!fs.existsSync(oldPath)) {
    return res.status(404).json({ message: "Original file not found" });
  }

  try {
    const existingPdfBytes = fs.readFileSync(oldPath);
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const pages = pdfDoc.getPages();
    const lastPage = pages[pages.length - 1];

    const date = new Date().toLocaleString();

    lastPage.drawText(`Approver: ${approver}`, {
      x: 50,
      y: 50,
      size: 10,
      color: rgb(0.5, 0, 0),
    });

    lastPage.drawText(`Approved on: ${date}`, {
      x: 50,
      y: 35,
      size: 8,
      color: rgb(0.3, 0.3, 0.3),
    });

    const signedPdfBytes = await pdfDoc.save();
    fs.writeFileSync(newPath, signedPdfBytes);

    fs.unlinkSync(oldPath);
    res.json({ message: "Report approved and moved" });
  } catch (error) {
    console.error("Error approving PDF:", error);
    res.status(500).json({ message: "Failed to approve report" });
  }
});

module.exports = router;
