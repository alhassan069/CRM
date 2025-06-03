const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// Get current user profile
router.get('/me', authMiddleware.verifyToken, userController.getCurrentUser);

// Get all users (admin only)
router.get('/', authMiddleware.verifyToken, userController.getAllUsers);

// Get user by ID
router.get('/:id', authMiddleware.verifyToken, userController.getUserById);

module.exports = router; 