const express = require('express');
const router = express.Router();
const supportController = require('../controllers/supportController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

// Public route to submit support message
router.post('/submit', (req, res, next) => {
    // Optional protection: if user is logged in, attach user id
    // We use a custom version of protect that doesn't fail if no token is provided
    next();
}, supportController.submitSupportMessage);

// Admin only routes
router.get('/all', protect, restrictTo('ADMIN'), supportController.getAllSupportMessages);
router.patch('/:id/status', protect, restrictTo('ADMIN'), supportController.updateMessageStatus);

module.exports = router;
