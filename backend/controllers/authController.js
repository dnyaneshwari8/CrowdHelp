const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { sendConfirmationEmail } = require('../utils/emailSender');

// Helper function to sign JWT token
const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'crowdhelp_jwt_secret', {
        expiresIn: process.env.JWT_EXPIRES_IN || '30d'
    });
};

// Generate 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

/**
 * Register a new user
 * Instant verification without Google SMTP requirements
 */
exports.register = async (req, res) => {
    try {
        const { name, email, phone, password, confirmPassword } = req.body;

        // Validation
        if (!name || !email || !phone || !password || !confirmPassword) {
            return res.status(400).json({ message: 'Please provide all required fields (name, email, phone, password, confirmPassword)' });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ $or: [{ email: email.toLowerCase().trim() }, { phone: phone.trim() }] });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists with this email or phone number' });
        }

        const otp = generateOTP();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins expiry

        // Auto-verify user on registration (bypassing Google SMTP requirement)
        const newUser = await User.create({
            name,
            email: email.toLowerCase().trim(),
            phone: phone.trim(),
            password,
            isVerified: true,
            otp,
            otpExpires
        });

        // Send confirmation email (simulated / mock safe)
        try {
            await sendConfirmationEmail(
                { donorEmail: email, donorName: name }, 
                null, 
                `Welcome to CrowdHelp, ${name}! Your account has been created and verified successfully.`,
                'Welcome to CrowdHelp!'
            );
        } catch (emailErr) {
            console.warn('[Registration Email Note] Email notification skipped:', emailErr.message);
        }

        const token = signToken(newUser._id);

        res.status(201).json({
            status: 'success',
            message: 'Registration successful! Your account is active.',
            token,
            data: { user: newUser }
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
            error: error.message
        });
    }
};

/**
 * Verify OTP for account activation or password reset
 */
exports.verifyOTP = async (req, res) => {
    try {
        const { email, otp, type } = req.body;
        console.log(`[OTP Verification] Email: ${email}, OTP: ${otp}, Type: ${type}`);

        const user = await User.findOne({ email: email.toLowerCase().trim() });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Accept user's stored OTP or default demo OTP '123456'
        const isValid = (user.otp && user.otp === otp && user.otpExpires > Date.now()) || otp === '123456';

        if (!isValid) {
            return res.status(400).json({ message: 'Invalid or expired OTP. (Demo OTP: 123456)' });
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
        const loginId = req.body.identifier || req.body.email || req.body.phone;
        const password = req.body.password;

        if (!loginId || !password) {
            return res.status(400).json({ message: 'Please provide email/phone and password' });
        }

        const cleanIdentifier = String(loginId).trim();
        const user = await User.findOne({ 
            $or: [{ email: cleanIdentifier.toLowerCase() }, { phone: cleanIdentifier }] 
        }).select('+password');

        if (!user || !(await user.comparePassword(password, user.password))) {
            return res.status(401).json({ message: 'Incorrect email/phone or password' });
        }

        if (!user.isVerified) {
            // Auto-activate for smooth demo experience
            user.isVerified = true;
            await user.save();
        }

        if (user.isBlocked) {
            return res.status(403).json({ message: 'Your account is blocked by administrator' });
        }

        const token = signToken(user._id);

        // Don't expose password
        user.password = undefined;

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
        console.log(`[Forgot Password] Request for: ${email}`);
        const user = await User.findOne({ email: email.toLowerCase().trim() });

        if (!user) {
            return res.status(404).json({ message: 'No user found with this email address' });
        }

        const otp = generateOTP();
        user.otp = otp;
        user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
        await user.save();

        console.log(`\n========================================`);
        console.log(`[PASSWORD RESET OTP for ${email}]: ${otp}`);
        console.log(`========================================\n`);

        await sendConfirmationEmail(
            { donorEmail: email, donorName: user.name }, 
            null, 
            `Your OTP for password reset is ${otp} (Valid for 10 minutes).`, 
            'Password Reset OTP'
        );

        res.status(200).json({ 
            message: `OTP generated successfully! Check your email or console (Demo OTP: ${otp})`,
            otp: otp // Also provide OTP in response for frictionless testing
        });
    } catch (error) {
        console.error('[Forgot Password] ERROR:', error);
        res.status(500).json({ message: error.message });
    }
};

/**
 * Reset Password
 */
exports.resetPassword = async (req, res) => {
    try {
        const { email, otp, password } = req.body;
        
        const user = await User.findOne({ 
            email: email.toLowerCase().trim()
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isValid = (user.otp && user.otp === otp && user.otpExpires > Date.now()) || otp === '123456';

        if (!isValid) {
            return res.status(400).json({ message: 'Invalid or expired OTP. (Demo OTP: 123456)' });
        }

        user.password = password;
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        res.status(200).json({ message: 'Password reset successful. You can now login with your new password.' });
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
