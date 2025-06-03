const express = require('express');
const router = express.Router();

// Import lead controller
const leadController = require('../controllers/lead.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// Routes
router.get('/', authMiddleware.verifyToken, leadController.getAllLeads);
router.get('/statuses', authMiddleware.verifyToken, leadController.getAllLeadStatuses);
router.get('/:id', authMiddleware.verifyToken, leadController.getLeadById);
router.post('/', authMiddleware.verifyToken, leadController.createLead);
router.put('/:id', authMiddleware.verifyToken, leadController.updateLead);
router.patch('/:id/status', authMiddleware.verifyToken, leadController.updateLeadStatus);
router.patch('/:id/assign', authMiddleware.verifyToken, authMiddleware.isAdmin, leadController.assignLead);
router.delete('/:id', authMiddleware.verifyToken, authMiddleware.isAdmin, leadController.deleteLead);

module.exports = router; 