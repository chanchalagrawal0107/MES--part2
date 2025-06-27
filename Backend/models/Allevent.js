const express = require('express');
const router = express.Router();
const { sql, alarmPool } = require('../db/alarmsdb.js');

// POST /api/login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Username and password are required' });
  }

  try {
    const pool = await alarmPool;

    const result = await pool
      .request()
      .input('username', sql.VarChar, username)
      .input('password', sql.VarChar, password)
      .query('SELECT * FROM Users WHERE username = @username AND password = @password');

    const user = result.recordset[0];

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid login credentials' });
    }

    res.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        username: user.username
      }
    });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
