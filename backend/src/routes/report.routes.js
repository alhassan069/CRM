const express = require('express');
const router = express.Router();
const reportController = require('../controllers/report.controller');
const { verifyToken, isAdmin } = require('../middlewares/auth.middleware');

// Apply authentication middleware to all report routes
router.use(verifyToken);
router.use(isAdmin); // Only admins can access reports

// Conversion funnel endpoint
router.get('/conversion-funnel', reportController.getConversionFunnel);

// Leads by rep endpoint
router.get('/leads-by-rep', reportController.getLeadsByRep);

// Activity metrics endpoint
router.get('/activity-metrics', reportController.getActivityMetrics);

// Lead source effectiveness endpoint
router.get('/lead-source-effectiveness', reportController.getLeadSourceEffectiveness);

module.exports = router; 