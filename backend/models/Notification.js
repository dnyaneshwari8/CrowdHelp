const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: [
            'DONATION_SUCCESS',
            'RECEIPT_GENERATED',
            'CERTIFICATE_GENERATED',
            'NGO_APPLICATION_SUBMITTED',
            'NGO_APPLICATION_APPROVED',
            'NGO_APPLICATION_REJECTED',
            'CAMPAIGN_APPROVED',
            'CAMPAIGN_REJECTED',
            'NEW_DONATION_RECEIVED',
            'CAMPAIGN_GOAL_ACHIEVED',
            'CAMPAIGN_COMPLETED',
            'ADMIN_ACTION',
            'FAVORITE_SAVED'
        ],
        required: true
    },
    isRead: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

// Index for performance
notificationSchema.index({ userId: 1, createdAt: -1 });
notificationSchema.index({ userId: 1, isRead: 1 });

module.exports = mongoose.model('Notification', notificationSchema);
