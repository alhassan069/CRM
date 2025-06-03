const jwt = require('jsonwebtoken');
const db = require('../models');
const User = db.user;
const Role = db.role;

// Verify JWT token middleware
exports.verifyToken = (req, res, next) => {
  // Get token from Authorization header
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN format
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  } catch (error) {
    console.error("Token verification error:", error);
    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};

// Check if user is admin middleware
exports.isAdmin = (req, res, next) => {
  if (req.userRole === 'admin') {
    next();
  } else {
    return res.status(403).json({ message: 'Require Admin Role!' });
  }
};

// Check if user is sales rep middleware
exports.isRep = (req, res, next) => {
  if (req.userRole === 'rep') {
    next();
  } else {
    return res.status(403).json({ message: 'Require Sales Rep Role!' });
  }
};

// Check if user is either admin or sales rep (any authenticated user)
exports.isAuthenticated = (req, res, next) => {
  if (req.userRole === 'admin' || req.userRole === 'rep') {
    next();
  } else {
    return res.status(403).json({ message: 'Unauthorized: Invalid role' });
  }
}; 