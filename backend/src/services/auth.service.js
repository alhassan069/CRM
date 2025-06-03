const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../models');
const User = db.user;
const Role = db.role;

/**
 * Hash a password
 * @param {string} password - Plain text password
 * @returns {string} - Hashed password
 */
exports.hashPassword = (password) => {
  return bcrypt.hashSync(password, 10);
};

/**
 * Verify if a password matches a hash
 * @param {string} password - Plain text password
 * @param {string} hash - Hashed password
 * @returns {boolean} - True if password matches hash
 */
exports.verifyPassword = (password, hash) => {
  return bcrypt.compareSync(password, hash);
};

/**
 * Generate a JWT token
 * @param {Object} userData - User data to encode in token
 * @returns {string} - JWT token
 */
exports.generateToken = (userData) => {
  return jwt.sign(
    userData,
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
};

/**
 * Verify a JWT token
 * @param {string} token - JWT token to verify
 * @returns {Object|null} - Decoded token or null if invalid
 */
exports.verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    console.error("Token verification error:", error);
    return null;
  }
}; 