const express = require('express');
const router = express.Router();

// Import activity controller and auth middleware
const activityController = require('../controllers/activity.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// Routes
router.get('/leads/:id/activities', authMiddleware.verifyToken, activityController.getActivitiesByLead);
router.post('/leads/:id/activities', authMiddleware.verifyToken, activityController.createActivity);
router.get('/user/activities', authMiddleware.verifyToken, activityController.getUserActivities);

module.exports = router; 