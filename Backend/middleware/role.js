const jwt = require('jsonwebtoken');
const JWT_SECRET = "Rockwell1";

const checkRole = (role) => {
  return (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token" });

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;

      if (decoded.role !== role) {
        return res.status(403).json({ message: "Access denied for role" });
      }

      next();
    } catch (err) {
      res.status(401).json({ message: "Invalid token" });
    }
  };
};

module.exports = { checkRole };
