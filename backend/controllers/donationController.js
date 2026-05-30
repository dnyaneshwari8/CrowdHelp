const Razorpay = require('razorpay');
const crypto = require('crypto');
const Donation = require('../models/Donation');
const { generateReceipt } = require('../utils/pdfGenerator');
const { sendConfirmationEmail } = require('../utils/emailSender');
const path = require('path');
const fs = require('fs');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET,
});

/**
 * Create a new order in Razorpay and save as pending in MongoDB
 */
exports.createOrder = async (req, res) => {
    try {
        const { amount, donorName, donorEmail } = req.body;

        if (!amount || !donorName || !donorEmail) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const options = {
            amount: amount * 100, // Amount in paise
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options);

        // Save donation as pending in MongoDB
        const newDonation = new Donation({
            donorName,
            donorEmail,
            amount,
            razorpay_order_id: order.id,
            status: 'pending'
        });

        await newDonation.save();

        res.status(200).json({
            ...order,
            donorName,
            donorEmail
        });
    } catch (error) {
        console.error("Create Order Error:", error);
        res.status(500).json({ message: "Error creating order", error: error.message });
    }
};

/**
 * Verify Razorpay payment signature
 */
exports.verifyPayment = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        } = req.body;

        // Step 1: Create HMAC signature to verify the payment
        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_SECRET)
            .update(body.toString())
            .digest("hex");

        const isAuthentic = expectedSignature === razorpay_signature;

        if (isAuthentic) {
            // Step 2: Update donation status in MongoDB
            const donation = await Donation.findOneAndUpdate(
                { razorpay_order_id: razorpay_order_id },
                {
                    razorpay_payment_id,
                    razorpay_signature,
                    status: 'completed'
                },
                { new: true }
            );

            if (!donation) {
                return res.status(404).json({ message: "Donation record not found" });
            }

            // Step 3: Generate PDF Receipt
            const pdfPath = await generateReceipt(donation);

            // Step 4: Send Confirmation Email with PDF
            await sendConfirmationEmail(donation, pdfPath);

            res.status(200).json({
                message: "Payment Verified Successfully",
                donationId: donation._id
            });
        } else {
            // Update status to failed
            await Donation.findOneAndUpdate(
                { razorpay_order_id: razorpay_order_id },
                { status: 'failed' }
            );
            res.status(400).json({ message: "Invalid Signature, Payment Verification Failed" });
        }
    } catch (error) {
        console.error("Verify Payment Error:", error);
        res.status(500).json({ message: "Error verifying payment", error: error.message });
    }
};

/**
 * Get all successful donations
 */
exports.getDonations = async (req, res) => {
    try {
        const donations = await Donation.find({ status: 'completed' }).sort({ createdAt: -1 });
        res.status(200).json(donations);
    } catch (error) {
        res.status(500).json({ message: "Error fetching donations", error: error.message });
    }
};

/**
 * Download Receipt PDF
 */
exports.downloadReceipt = async (req, res) => {
    try {
        const { id } = req.params;
        const filePath = path.join(__dirname, '../receipts', `receipt_${id}.pdf`);

        if (fs.existsSync(filePath)) {
            res.download(filePath);
        } else {
            // If file doesn't exist, try to regenerate it if donation exists
            const donation = await Donation.findById(id);
            if (donation && donation.status === 'completed') {
                const newPath = await generateReceipt(donation);
                res.download(newPath);
            } else {
                res.status(404).json({ message: "Receipt not found" });
            }
        }
    } catch (error) {
        res.status(500).json({ message: "Error downloading receipt", error: error.message });
    }
};
