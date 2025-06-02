// middlewares/verifyAccessToken.js

const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>
    if (!token) return res.status(401).json({ message: 'No token provided' });
    jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, payload) => {
        if (err) return res.status(403).json({ message: 'Invalid or expired token' });
        req.user = payload;
        next();
    });
};

// Stub permission middleware for testing (always allows)
const checkPermission = () => (req, res, next) => next();

module.exports = {
    authenticateToken,
    checkPermission
};
