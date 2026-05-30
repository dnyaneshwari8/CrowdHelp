const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

// Protect all routes in this router and restrict to ADMIN
router.use(protect);
router.use(restrictTo('ADMIN'));

router.get('/users', adminController.getAllUsers);
router.get('/users/:id', adminController.getUserDetails);
router.get('/donations', adminController.getAllDonations);
router.get('/analytics', adminController.getAdvancedAnalytics);
router.get('/export-donations', adminController.exportDonations);
router.post('/block-user', adminController.toggleUserBlock);

module.exports = router;
