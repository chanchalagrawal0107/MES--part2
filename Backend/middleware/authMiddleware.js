const jwt = require('jsonwebtoken');
const JWT_SECRET = "Rockwell1"; // Use same secret

function verifyToken(req, res, next) {
  const token = req.headers['authorization'];

  if (!token) return res.status(403).json({ message: 'Token missing' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Attach user to request
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

module.exports = verifyToken;
