// routes/fileWorkflow.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const { checkRole } = require('../middleware/role');
const router = express.Router();

const BASE = path.join(__dirname, '../reports');

// 📁 List files
router.get('/files/:role', checkRole('Reviewer'), (req, res, next) => {
  if (req.params.role === 'approver') return next();
  const dir = path.join(BASE, 'generated');
  return res.json({ files: fs.readdirSync(dir).filter(f => f.endsWith('.pdf')) });
}, checkRole('Approver'), (req, res) => {
  const dir = path.join(BASE, 'reviewed');
  res.json({ files: fs.readdirSync(dir).filter(f => f.endsWith('.pdf')) });
});

// ✍️ Sign & move file
router.post('/sign', (req, res) => {
  const { filename, role } = req.body;
  const sourceDir = role === 'reviewer' ? 'generated' : 'reviewed';
  const targetDir = role === 'reviewer' ? 'reviewed' : 'approved';

  const src = path.join(BASE, sourceDir, filename);
  const dst = path.join(BASE, targetDir, filename);

  if (!fs.existsSync(src)) return res.status(404).json({ message: 'File not found' });
  fs.rename(src, dst, (err) => {
    if (err) return res.status(500).json({ message: 'Error moving file' });
    res.json({ message: `✅ ${role.charAt(0).toUpperCase()+role.slice(1)} moved to ${targetDir}` });
  });
});

module.exports = router;
