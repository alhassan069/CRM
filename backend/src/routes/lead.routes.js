const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// Import lead controller
const leadController = require('../controllers/lead.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// Multer disk storage config for CSV uploads
const upload = multer({
  dest: path.join(__dirname, '../../uploads'),
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files are allowed!'), false);
    }
  }
});

// Routes
router.get('/', authMiddleware.verifyToken, leadController.getAllLeads);
router.get('/statuses', authMiddleware.verifyToken, leadController.getAllLeadStatuses);
router.get('/:id', authMiddleware.verifyToken, leadController.getLeadById);
router.post('/', authMiddleware.verifyToken, leadController.createLead);
router.put('/:id', authMiddleware.verifyToken, leadController.updateLead);
router.patch('/:id/status', authMiddleware.verifyToken, leadController.updateLeadStatus);
router.patch('/:id/assign', authMiddleware.verifyToken, authMiddleware.isAdmin, leadController.assignLead);
router.delete('/:id', authMiddleware.verifyToken, authMiddleware.isAdmin, leadController.deleteLead);
router.post('/upload', authMiddleware.verifyToken, authMiddleware.isAdmin, upload.single('file'), leadController.uploadLeadsFromCSV);

module.exports = router; 