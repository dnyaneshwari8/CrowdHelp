const express = require('express');
const router = express.Router();
const ngoController = require('../controllers/ngoController');
const { protect, restrictTo } = require('../middleware/authMiddleware');
const upload = require('../utils/multerConfig');

// All routes here require the user to be an NGO and have an APPROVED status
const checkApprovedNGO = (req, res, next) => {
    if (req.user.role !== 'NGO' || req.user.ngoStatus !== 'APPROVED') {
        return res.status(403).json({ 
            message: 'Access denied. Only approved NGOs can access this dashboard.' 
        });
    }
    next();
};

router.use(protect);
router.use(checkApprovedNGO);

router.get('/dashboard', ngoController.getDashboardStats);
router.get('/analytics', ngoController.getNGOAnalytics);
router.get('/my-campaigns', ngoController.getMyCampaigns);
router.get('/donations', ngoController.getDonationsReceived);
router.patch('/profile', upload.single('organizationLogo'), ngoController.updateNGOProfile);

module.exports = router;
