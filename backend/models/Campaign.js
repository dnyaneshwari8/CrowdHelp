const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide a campaign title'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Please provide a campaign description']
    },
    image: {
        type: String,
        required: [true, 'Please provide a campaign image']
    },
    category: {
        type: String,
        required: [true, 'Please provide a category'],
        enum: ['Education', 'Health', 'Environment', 'Animal Welfare', 'Disaster Relief', 'Other']
    },
    goalAmount: {
        type: Number,
        required: [true, 'Please provide a goal amount']
    },
    currentAmount: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['Active', 'Completed', 'Paused'],
        default: 'Active'
    },
    startDate: {
        type: Date,
        required: [true, 'Please provide a start date']
    },
    endDate: {
        type: Date,
        required: [true, 'Please provide an end date']
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Campaign', campaignSchema);
