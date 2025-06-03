const express = require('express');
const router = express.Router();

const taskController = require('../controllers/task.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// Routes
router.get('/', authMiddleware.verifyToken, taskController.getTasks);
router.post('/', authMiddleware.verifyToken, taskController.createTask);
router.put('/:id', authMiddleware.verifyToken, taskController.updateTask);
router.patch('/:id/complete', authMiddleware.verifyToken, taskController.toggleTaskCompletion);
router.delete('/:id', authMiddleware.verifyToken, taskController.deleteTask);

module.exports = router; 