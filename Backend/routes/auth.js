const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { sql, userPool } = require('../db/userdb');

const JWT_SECRET = "Rockwell1";


router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const pool = await userPool;
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
