const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide your name'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        unique: true,
        lowercase: true,
        trim: true
    },
    phone: {
        type: String,
        required: [true, 'Please provide your phone number'],
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 6,
        select: false // Don't return password by default
    },
    role: {
        type: String,
        enum: ['USER', 'NGO', 'ADMIN'],
        default: 'USER'
    },
    // NGO Specific Fields
    organizationName: { type: String, trim: true },
    organizationDescription: { type: String },
    organizationEmail: { type: String, lowercase: true, trim: true },
    organizationPhone: { type: String, trim: true },
    registrationNumber: { type: String, trim: true },
    website: { type: String, trim: true },
    organizationLogo: { type: String, default: '' },
    ngoStatus: {
        type: String,
        enum: ['PENDING', 'APPROVED', 'REJECTED', 'NONE'],
        default: 'NONE'
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    otp: String,
    otpExpires: Date,
    isBlocked: {
        type: Boolean,
        default: false
    },
    profileImage: {
        type: String,
        default: ''
    },
    favorites: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Campaign'
    }],
    certificates: [{
        type: String // Store certificate IDs or paths
    }]
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function() {
    if (!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 12);
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

module.exports = mongoose.model('User', userSchema);
