const mongoose = require('mongoose');

/**
 * Donation Schema
 * Stores all donation details including Razorpay IDs and payment status.
 */
const donationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true 
    },
    campaignId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Campaign',
        required: true
    },
    ngoId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false // Populated for NGO-owned campaigns
    },
    isAnonymous: {
        type: Boolean,
        default: false
    },
    certificateId: {
        type: String
    },
    receiptUrl: {
        type: String
    },
    certificateUrl: {
        type: String
    },
    donorName: {
        type: String,
        required: true,
        trim: true
    },
    donorEmail: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    amount: {
        type: Number,
        required: true
    },
    razorpay_order_id: {
        type: String,
        required: true
    },
    razorpay_payment_id: {
        type: String,
        required: false // Optional initially, filled after verification
    },
    razorpay_signature: {
        type: String,
        required: false
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

// Optimize frequent dashboard and search queries
donationSchema.index({ userId: 1, status: 1 });
donationSchema.index({ ngoId: 1, status: 1 });
donationSchema.index({ campaignId: 1, status: 1 });
donationSchema.index({ razorpay_order_id: 1 });
donationSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Donation', donationSchema);
