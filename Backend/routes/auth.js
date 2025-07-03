const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { sql, poolPromise } = require('../db/userdb');  

const JWT_SECRET = "Rockwell1";
const JWT_EXPIRES = process.env.JWT_EXPIRES || '1d';

// Register API
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Please provide all required fields' });
  }

  try {
    const pool = await poolPromise;

    // Check if user exists
    const checkUser = await pool.request()
      .input('email', sql.VarChar, email)
      .query('SELECT * FROM Users WHERE emailId = @email');

    if (checkUser.recordset.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Insert new user
    await pool.request()
      .input('username', sql.VarChar, username)
      .input('email', sql.VarChar, email)
      .input('password', sql.VarChar, password)
      .query('INSERT INTO Users (username, emailId, password) VALUES (@username, @email, @password)');

    // Issue token
    const token = jwt.sign({username }, JWT_SECRET, { expiresIn: JWT_EXPIRES });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log('Login payload:', username, password); // 🧪 Log input
    
    if (!username || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }
    
    const pool = await poolPromise;
    
    const result = await pool.request()
    .input('username', sql.VarChar, username)
    .query('SELECT * FROM Users WHERE username = @username'); 
    
    const user = result.recordset[0];
    
    if (!user || user.password !== password) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
    
    return res.json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.emailId,
      }
    });
  } catch (err) {
    console.error('Login error:', err); 
    return res.status(500).json({ message: 'Server error during login' });
  }
});


// Verify token API
router.get('/verify', async (req, res) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    
    const pool = await poolPromise;
    
    const result = await pool.request()
    .input('username', sql.VarChar, decoded.username)
    .query('SELECT id, username, emailId FROM Users WHERE username = @username');
    
    const user = result.recordset[0];

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ success: true, user });
  } catch (error) {
    console.error('Verify error:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
});

// Reset Password API
router.post('/resetpassword', async (req, res) => {
  const { username, newPassword } = req.body;
  
  if (!username || !newPassword) {
    return res.status(400).json({ message: 'Please provide username and new password' });
  }
  
  try {
    const pool = await poolPromise;
    
    const result = await pool.request()
    .input('username', sql.VarChar, username)
    .query('SELECT * FROM Users WHERE username = @username');
    
    const user = result.recordset[0];
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    await pool.request()
    .input('username', sql.VarChar, username)
    .input('password', sql.VarChar, newPassword)
    .query('UPDATE Users SET password = @password WHERE username = @username');
    
    res.json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    console.error('Reset error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;


