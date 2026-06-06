const mongoose = require('mongoose');

const supportMessageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide your name'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        lowercase: true,
        trim: true
    },
    subject: {
        type: String,
        required: [true, 'Please provide a subject'],
        trim: true
    },
    message: {
        type: String,
        required: [true, 'Please provide your message'],
        trim: true
    },
    status: {
        type: String,
        enum: ['NEW', 'IN_PROGRESS', 'RESOLVED'],
        default: 'NEW'
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false // Can be submitted by guests
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

module.exports = mongoose.model('SupportMessage', supportMessageSchema);
