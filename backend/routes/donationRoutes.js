const express = require('express');
const router = express.Router();
const donationController = require('../controllers/donationController');

// Route to create a Razorpay order
router.post('/create-order', donationController.createOrder);

// Route to verify Razorpay payment signature
router.post('/verify-payment', donationController.verifyPayment);

// Route to get all successful donations
router.get('/donations', donationController.getDonations);

// Route to download a receipt PDF
router.get('/download-receipt/:id', donationController.downloadReceipt);

module.exports = router;
