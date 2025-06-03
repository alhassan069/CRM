const express = require('express');
const router = express.Router();
const aiController = require('../controllers/ai.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

// Apply authentication middleware to all AI routes
router.use(verifyToken);

// Deal Coach AI endpoint
router.post('/leads/:id/deal-coach', aiController.getDealCoachAdvice);

// Customer Persona Builder endpoint
router.post('/leads/:id/persona', aiController.getCustomerPersona);

// Objection Handler endpoint
router.post('/objection-handler', aiController.handleObjection);

// Win-Loss Explainer endpoint
router.post('/win-loss-report', aiController.getWinLossInsights);

module.exports = router; 