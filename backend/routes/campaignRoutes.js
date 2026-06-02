const express = require('express');
const router = express.Router();
const campaignController = require('../controllers/campaignController');
const { protect, restrictTo } = require('../middleware/authMiddleware');
const upload = require('../utils/multerConfig');

// Public routes
router.get('/', campaignController.getAllCampaigns);
router.get('/:id', campaignController.getCampaignById);
router.get('/:id/updates', campaignController.getCampaignUpdates);

// Admin or Approved NGO can create campaigns
router.post('/', protect, restrictTo('ADMIN', 'NGO'), (req, res, next) => {
    if (req.user.role === 'NGO' && req.user.ngoStatus !== 'APPROVED') {
        return res.status(403).json({ message: 'Only approved NGOs can create campaigns' });
    }
    next();
}, (req, res, next) => {
    upload.single('image')(req, res, (err) => {
        if (err) {
            console.error('--- MULTER UPLOAD ERROR ---');
            console.error(err);
            return res.status(400).json({ 
                message: 'Error uploading image', 
                error: typeof err === 'string' ? err : err.message 
            });
        }
        next();
    });
}, campaignController.createCampaign);

router.patch('/:id', protect, restrictTo('ADMIN', 'NGO'), (req, res, next) => {
    upload.single('image')(req, res, (err) => {
        if (err) {
            return res.status(400).json({ 
                message: 'Error uploading image during update', 
                error: typeof err === 'string' ? err : err.message 
            });
        }
        next();
    });
}, campaignController.updateCampaign);
router.delete('/:id', protect, restrictTo('ADMIN'), campaignController.deleteCampaign);

module.exports = router;
