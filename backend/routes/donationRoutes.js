const express = require('express');
const router = express.Router();
const donationController = require('../controllers/donationController');
const { protect } = require('../middleware/authMiddleware');

// Route to create a Razorpay order (Protected)
router.post('/create-order', protect, donationController.createOrder);

// Route to verify Razorpay payment signature
router.post('/verify-payment', donationController.verifyPayment);

// Public leaderboard and donor wall
router.get('/leaderboard', donationController.getLeaderboard);
router.get('/donor-wall', donationController.getDonorWall);

// Route to get all successful donations
router.get('/donations', donationController.getDonations);

// Route to get current user's donations (Protected)
router.get('/my-donations', protect, donationController.getMyDonations);

// Route to download a receipt PDF
router.get('/download-receipt/:id', donationController.downloadReceipt);

// Route to download a certificate PDF
router.get('/download-certificate/:id', donationController.downloadCertificate);

module.exports = router;
