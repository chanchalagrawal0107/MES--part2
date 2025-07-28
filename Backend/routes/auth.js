const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { sql, poolPromise } = require('../db/userdb');  
const JWT_SECRET = "Rockwell1";

// Register API
router.post('/register', async (req, res) => {
  const { username, email, password, role } = req.body;

  if (!username || !email || !password || !role) {
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
      .input('role', sql.VarChar, role)
      .query('INSERT INTO Users (username, emailId, password, role) VALUES (@username, @email, @password, @role)');

    // Issue token
    const token = jwt.sign({username: user.username, role: user.role }, JWT_SECRET);

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
    const { username, password, role } = req.body;
    console.log('Login payload:', username, password); // 🧪 Log input
    
    if (!username || !password || !role) {
      return res.status(400).json({ message: 'Please provide email, password and correct role' });
    }
    
    const pool = await poolPromise;
    const result = await pool.request()
    .input('username', sql.VarChar, username)
    .query('SELECT * FROM Users WHERE username = @username'); 
    
    const user = result.recordset[0];
    
    if (!user || user.password !== password || user.role !==role) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ username: user.username, role: user.role }, JWT_SECRET);
    return res.json({ success: true, token, user: { id: user.id, username: user.username, role: user.role } });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
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
    .query('SELECT id, username, emailId, role FROM Users WHERE username = @username');
    
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
// ✅ Middleware to verify JWT token
function verifyToken(req, res, next) {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("❌ Invalid token", err.message);
    return res.status(401).json({ message: 'Invalid token' });
  }
}

// ✅ Middleware to authorize based on user role
function authorizeRole(role) {
  return (req, res, next) => {
    if (req.user && req.user.role === role) {
      next();
    } else {
      return res.status(403).json({ message: 'Forbidden: insufficient role' });
    }
  };
}

module.exports = {
  router,
  verifyToken,
  authorizeRole
};


