const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

// Protect all routes in this router and restrict to ADMIN
router.use(protect);
router.use(restrictTo('ADMIN'));

router.get('/users', adminController.getAllUsers);
router.get('/campaigns', adminController.getAllCampaignsForAdmin);
router.get('/users/:id', adminController.getUserDetails);
router.get('/donations', adminController.getAllDonations);
router.get('/analytics', adminController.getAdvancedAnalytics);
router.get('/export-donations', adminController.exportDonations);
router.post('/block-user', adminController.toggleUserBlock);

// NGO and Campaign Management
router.get('/ngo-applications', adminController.getNGOApplications);
router.post('/approve-ngo', adminController.approveNGO);
router.post('/reject-ngo', adminController.rejectNGO);
router.get('/pending-campaigns', adminController.getPendingCampaigns);
router.post('/approve-campaign', adminController.approveCampaign);
router.post('/reject-campaign', adminController.rejectCampaign);
router.get('/audit-logs', adminController.getAuditLogs);

module.exports = router;
