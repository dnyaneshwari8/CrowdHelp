const Razorpay = require('razorpay');
const crypto = require('crypto');
const Donation = require('../models/Donation');
const Campaign = require('../models/Campaign');
const User = require('../models/User');
const { generateReceipt } = require('../utils/pdfGenerator');
const { generateCertificate } = require('../utils/certificateGenerator');
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
        const { amount, campaignId, isAnonymous } = req.body;
        
        const donorName = req.user.name;
        const donorEmail = req.user.email;
        const userId = req.user._id;

        if (!amount || !campaignId) {
            return res.status(400).json({ message: "Amount and Campaign ID are required" });
        }

        const options = {
            amount: amount * 100, 
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options);

        const newDonation = new Donation({
            userId,
            campaignId,
            donorName,
            donorEmail,
            amount,
            isAnonymous: isAnonymous || false,
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

        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_SECRET)
            .update(body.toString())
            .digest("hex");

        const isAuthentic = expectedSignature === razorpay_signature;

        if (isAuthentic) {
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

            // Update Campaign currentAmount
            const campaign = await Campaign.findByIdAndUpdate(
                donation.campaignId,
                { $inc: { currentAmount: donation.amount } },
                { new: true }
            );

            // Generate Receipt
            const pdfPath = await generateReceipt(donation);
            
            // Generate Certificate
            const certPath = await generateCertificate(donation, campaign);
            
            // Update User with certificate
            await User.findByIdAndUpdate(donation.userId, {
                $push: { certificates: donation._id }
            });

            // Send Confirmation Email (Receipt)
            await sendConfirmationEmail(donation, pdfPath);

            res.status(200).json({
                message: "Payment Verified Successfully",
                donationId: donation._id
            });
        } else {
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
 * Get Public Donor Wall
 */
exports.getDonorWall = async (req, res) => {
    try {
        const donations = await Donation.find({ status: 'completed' })
            .populate('campaignId', 'title')
            .sort('-createdAt')
            .limit(50);

        const donorWall = donations.map(d => ({
            donorName: d.isAnonymous ? 'Anonymous Donor' : d.donorName,
            campaignTitle: d.campaignId ? d.campaignId.title : 'General Fund',
            amount: d.amount,
            date: d.createdAt
        }));

        res.status(200).json({ status: 'success', data: { donorWall } });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Get Leaderboard (Top Donors)
 */
exports.getLeaderboard = async (req, res) => {
    try {
        const leaderboard = await Donation.aggregate([
            { $match: { status: 'completed' } },
            {
                $group: {
                    _id: '$userId',
                    totalDonated: { $sum: '$amount' },
                    donorName: { $first: '$donorName' }
                }
            },
            { $sort: { totalDonated: -1 } },
            { $limit: 10 }
        ]);

        res.status(200).json({ status: 'success', data: { leaderboard } });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Download Certificate PDF
 */
exports.downloadCertificate = async (req, res) => {
    try {
        const { id } = req.params;
        const filePath = path.join(__dirname, '../certificates', `certificate_${id}.pdf`);

        if (fs.existsSync(filePath)) {
            res.download(filePath);
        } else {
            const donation = await Donation.findById(id).populate('campaignId');
            if (donation && donation.status === 'completed') {
                const newPath = await generateCertificate(donation, donation.campaignId);
                res.download(newPath);
            } else {
                res.status(404).json({ message: "Certificate not found" });
            }
        }
    } catch (error) {
        res.status(500).json({ message: "Error downloading certificate", error: error.message });
    }
};

/**
 * Existing methods kept but updated for user scope
 */
exports.getMyDonations = async (req, res) => {
    try {
        const donations = await Donation.find({ userId: req.user.id, status: 'completed' })
            .populate('campaignId', 'title')
            .sort('-createdAt');
        res.status(200).json({ status: 'success', data: { donations } });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getDonations = async (req, res) => {
    try {
        const donations = await Donation.find({ status: 'completed' })
            .populate('campaignId', 'title')
            .populate('userId', 'name email')
            .sort({ createdAt: -1 });
        res.status(200).json(donations);
    } catch (error) {
        res.status(500).json({ message: "Error fetching donations", error: error.message });
    }
};

exports.downloadReceipt = async (req, res) => {
    try {
        const { id } = req.params;
        const filePath = path.join(__dirname, '../receipts', `receipt_${id}.pdf`);

        if (fs.existsSync(filePath)) {
            res.download(filePath);
        } else {
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
