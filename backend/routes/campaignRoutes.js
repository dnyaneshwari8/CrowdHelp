const express = require('express');
const router = express.Router();
const campaignController = require('../controllers/campaignController');
const { protect, restrictTo } = require('../middleware/authMiddleware');
const upload = require('../utils/multerConfig');

// Public routes
router.get('/', campaignController.getAllCampaigns);
router.get('/:id', campaignController.getCampaignById);

// Admin only routes
router.post('/', protect, restrictTo('ADMIN'), upload.single('image'), campaignController.createCampaign);
router.patch('/:id', protect, restrictTo('ADMIN'), upload.single('image'), campaignController.updateCampaign);
router.delete('/:id', protect, restrictTo('ADMIN'), campaignController.deleteCampaign);

module.exports = router;
