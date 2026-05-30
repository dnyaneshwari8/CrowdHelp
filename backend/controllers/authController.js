const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { sendConfirmationEmail } = require('../utils/emailSender'); // Reusing existing email sender or creating new one if needed

// Helper function to sign JWT token
const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};

// Generate 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

/**
 * Register a new user
 */
exports.register = async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;

        // Validation
        if (!name || !email || !phone || !password) {
            return res.status(400).json({ message: 'Please provide all required fields (name, email, phone, password)' });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists with this email or phone' });
        }

        const otp = generateOTP();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins expiry

        const newUser = await User.create({
            name,
            email,
            phone,
            password,
            otp,
            otpExpires
        });

        // Send OTP via email
        try {
            await sendConfirmationEmail({ donorEmail: email, donorName: name, amount: 'OTP Verification' }, null, `Your OTP for registration is ${otp}`);
        } catch (emailErr) {
            console.error('Email sending failed during registration:', emailErr);
            // We don't return 500 here because the user is already created in DB
            // They can use 'resend OTP' later
        }

        res.status(201).json({
            status: 'success',
            message: 'Registration successful. Please verify your email with the OTP sent.'
        });
    } catch (error) {
        console.error('--- REGISTRATION ERROR DETAILS ---');
        console.error('Name:', error.name);
        console.error('Message:', error.message);
        
        // Handle Mongoose Validation Errors
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ message: messages.join(', ') });
        }

        // Handle Mongoose Duplicate Key Errors (11000)
        if (error.code === 11000) {
            const field = Object.keys(error.keyValue)[0];
            return res.status(400).json({ message: `Duplicate value for ${field}. Please use another one.` });
        }

        res.status(500).json({ 
            message: 'Internal Server Error during registration', 
            error: error.message,
            tip: 'Check if your MongoDB is running or your .env variables are correct.'
        });
    }
};

/**
 * Verify OTP for account activation or password reset
 */
exports.verifyOTP = async (req, res) => {
    try {
        const { email, otp, type } = req.body;

        const user = await User.findOne({ email, otp, otpExpires: { $gt: Date.now() } });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        if (type === 'registration') {
            user.isVerified = true;
        }
        
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        const token = signToken(user._id);

        res.status(200).json({
            status: 'success',
            token,
            data: { user }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Login user
 */
exports.login = async (req, res) => {
    try {
        const { identifier, password } = req.body; // identifier can be email or phone

        if (!identifier || !password) {
            return res.status(400).json({ message: 'Please provide email/phone and password' });
        }

        const user = await User.findOne({ 
            $or: [{ email: identifier }, { phone: identifier }] 
        }).select('+password');

        if (!user || !(await user.comparePassword(password, user.password))) {
            return res.status(401).json({ message: 'Incorrect email/phone or password' });
        }

        if (!user.isVerified) {
            return res.status(401).json({ message: 'Please verify your account first' });
        }

        if (user.isBlocked) {
            return res.status(403).json({ message: 'Your account is blocked' });
        }

        const token = signToken(user._id);

        res.status(200).json({
            status: 'success',
            token,
            data: { user }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Forgot Password
 */
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'No user found with this email address' });
        }

        const otp = generateOTP();
        user.otp = otp;
        user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
        await user.save();

        await sendConfirmationEmail({ donorEmail: email, donorName: user.name, amount: 'Password Reset' }, null, `Your OTP for password reset is ${otp}`);

        res.status(200).json({ message: 'OTP sent to your email' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Reset Password
 */
exports.resetPassword = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.password = password;
        await user.save();

        res.status(200).json({ message: 'Password reset successful. You can now login.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Change Password
 */
exports.changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const user = await User.findById(req.user.id).select('+password');

        if (!(await user.comparePassword(oldPassword, user.password))) {
            return res.status(401).json({ message: 'Incorrect old password' });
        }

        user.password = newPassword;
        await user.save();

        const token = signToken(user._id);
        res.status(200).json({ status: 'success', token, message: 'Password changed successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
