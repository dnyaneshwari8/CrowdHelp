const NGOApplication = require('../models/NGOApplication');
const User = require('../models/User');
const { emailService, notificationService } = require('../services/emailService');

/**
 * Submit an NGO application
 */
exports.submitApplication = async (req, res) => {
    try {
        const {
            organizationName,
            description,
            registrationNumber,
            email,
            phone,
            website,
            address
        } = req.body;

        // Check if user already has a pending or approved application
        const existingApp = await NGOApplication.findOne({ 
            userId: req.user.id,
            status: { $in: ['PENDING', 'APPROVED'] }
        });

        if (existingApp) {
            return res.status(400).json({ 
                message: 'You already have a pending or approved NGO application.' 
            });
        }

        // Check if registration number is already used
        const regNumExists = await NGOApplication.findOne({ registrationNumber });
        if (regNumExists) {
            return res.status(400).json({ message: 'Registration number already exists.' });
        }

        const applicationData = {
            userId: req.user.id,
            organizationName,
            description,
            registrationNumber,
            email,
            phone,
            website,
            address,
            status: 'PENDING'
        };

        // Handle file uploads (logo and certificate)
        if (req.files) {
            if (req.files.logo) {
                applicationData.logo = `/uploads/${req.files.logo[0].filename}`;
            }
            if (req.files.certificate) {
                applicationData.certificate = `/uploads/${req.files.certificate[0].filename}`;
            }
        }

        const application = await NGOApplication.create(applicationData);

        // Create notification for user
        await notificationService.create(
            req.user.id,
            'NGO Application Submitted',
            `Your application for "${organizationName}" has been successfully received and is under review.`,
            'NGO_APPLICATION_SUBMITTED'
        );

        // Notify Admin (get any admin user)
        const adminUser = await User.findOne({ role: 'ADMIN' });
        if (adminUser) {
            await notificationService.create(
                adminUser._id,
                'New NGO Application Pending',
                `A new NGO application for "${organizationName}" requires review.`,
                'NGO_APPLICATION_SUBMITTED'
            );
        }

        // Send confirmation email
        await emailService.sendNGOApplicationSubmitted(req.user);

        res.status(201).json({
            status: 'success',
            message: 'NGO application submitted successfully. Please wait for admin approval.',
            data: { application }
        });
    } catch (error) {
        console.error('NGO Application Error:', error);
        res.status(500).json({ message: error.message });
    }
};

/**
 * Get current user's NGO application
 */
exports.getMyApplication = async (req, res) => {
    try {
        const application = await NGOApplication.findOne({ userId: req.user.id }).sort('-createdAt');
        res.status(200).json({
            status: 'success',
            data: { application }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
