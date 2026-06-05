const NGOApplication = require('../models/NGOApplication');
const User = require('../models/User');
const { sendConfirmationEmail } = require('../utils/emailSender');

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
                applicationData.logo = req.files.logo[0].path;
            }
            if (req.files.certificate) {
                applicationData.certificate = req.files.certificate[0].path;
            }
        }

        const application = await NGOApplication.create(applicationData);

        // Send confirmation email
        await sendConfirmationEmail(
            { donorEmail: req.user.email, donorName: req.user.name },
            null,
            `Thank you for applying to become an NGO partner on CrowdHelp. Your application for "${organizationName}" (Reg No: ${registrationNumber}) has been received and is currently under review.\n\nWe will notify you once the admin has reviewed your application.\n\nBest Regards,\nCrowdHelp Team`,
            'NGO Application Received'
        );

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
