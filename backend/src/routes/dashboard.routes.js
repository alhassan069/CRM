const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// Dashboard metrics routes
router.get('/metrics/rep', authMiddleware.verifyToken, dashboardController.getSalesRepMetrics);
router.get('/metrics/admin', authMiddleware.verifyToken, authMiddleware.isAdmin, dashboardController.getSalesAdminMetrics);

// Tasks routes
router.get('/tasks', authMiddleware.verifyToken, dashboardController.getUserTasks);

// Lead status aggregation routes
router.get('/leads/by-status', authMiddleware.verifyToken, dashboardController.getLeadStatusAggregation);

// Activities routes
router.get('/activities/daily', authMiddleware.verifyToken, dashboardController.getDailyActivities);

module.exports = router; 