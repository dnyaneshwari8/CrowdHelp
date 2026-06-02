const User = require('../models/User');
const Donation = require('../models/Donation');
const Campaign = require('../models/Campaign');
const NGOApplication = require('../models/NGOApplication');
const AuditLog = require('../models/AuditLog');
const { emailService, notificationService } = require('../services/emailService');
const { Parser } = require('json2csv');

/**
 * NGO Application Management
 */
exports.getNGOApplications = async (req, res) => {
    try {
        const applications = await NGOApplication.find().sort('-createdAt').populate('userId', 'name email');
        res.status(200).json({ status: 'success', data: { applications } });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.approveNGO = async (req, res) => {
    try {
        const { applicationId, adminRemarks } = req.body;
        const application = await NGOApplication.findById(applicationId);
        if (!application) return res.status(404).json({ message: 'Application not found' });

        application.status = 'APPROVED';
        application.adminRemarks = adminRemarks;
        await application.save();

        const user = await User.findById(application.userId);
        user.role = 'NGO';
        user.ngoStatus = 'APPROVED';
        user.organizationName = application.organizationName;
        user.organizationDescription = application.description;
        user.organizationEmail = application.email;
        user.organizationPhone = application.phone;
        user.registrationNumber = application.registrationNumber;
        user.website = application.website;
        user.organizationLogo = application.logo;
        await user.save();

        // Create Audit Log
        await AuditLog.create({
            action: 'ADMIN_APPROVED_NGO',
            performedBy: req.user.id,
            targetId: user._id,
            targetModel: 'User',
            details: `Approved NGO: ${application.organizationName}`
        });

        // Create Notification
        await notificationService.create(
            user._id,
            'NGO Application Approved!',
            `Congratulations! Your NGO application for "${application.organizationName}" has been approved.`,
            'NGO_APPLICATION_APPROVED'
        );

        // Send Email
        await emailService.sendNGOApproved(user);

        res.status(200).json({ status: 'success', message: 'NGO approved successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.rejectNGO = async (req, res) => {
    try {
        const { applicationId, adminRemarks } = req.body;
        const application = await NGOApplication.findById(applicationId);
        if (!application) return res.status(404).json({ message: 'Application not found' });

        application.status = 'REJECTED';
        application.adminRemarks = adminRemarks;
        await application.save();

        const user = await User.findById(application.userId);
        user.ngoStatus = 'REJECTED';
        await user.save();

        // Create Audit Log
        await AuditLog.create({
            action: 'ADMIN_REJECTED_NGO',
            performedBy: req.user.id,
            targetId: application._id,
            targetModel: 'NGOApplication',
            details: `Rejected NGO application: ${application.organizationName}. Reason: ${adminRemarks}`
        });

        // Create Notification
        await notificationService.create(
            user._id,
            'NGO Application Rejected',
            `Your NGO application for "${application.organizationName}" has been rejected. Reason: ${adminRemarks}`,
            'NGO_APPLICATION_REJECTED'
        );

        // Send Email
        await emailService.sendNGORejected(user, adminRemarks);

        res.status(200).json({ status: 'success', message: 'NGO rejected successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Campaign Approval Workflow
 */
exports.getPendingCampaigns = async (req, res) => {
    try {
        const campaigns = await Campaign.find({ status: 'PENDING' })
            .sort('-createdAt')
            .populate('createdBy', 'name organizationName');
        res.status(200).json({ status: 'success', data: { campaigns } });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.approveCampaign = async (req, res) => {
    try {
        const { campaignId } = req.body;
        const campaign = await Campaign.findById(campaignId).populate('createdBy', 'name email');
        if (!campaign) return res.status(404).json({ message: 'Campaign not found' });

        campaign.status = 'APPROVED';
        await campaign.save();

        // Create Audit Log
        await AuditLog.create({
            action: 'ADMIN_APPROVED_CAMPAIGN',
            performedBy: req.user.id,
            targetId: campaign._id,
            targetModel: 'Campaign',
            details: `Approved campaign: ${campaign.title}`
        });

        // Create Notification
        if (campaign.createdByRole === 'NGO') {
            await notificationService.create(
                campaign.createdBy._id,
                'Campaign Approved!',
                `Your campaign "${campaign.title}" has been approved and is now live.`,
                'CAMPAIGN_APPROVED'
            );
        }

        // Send Email
        await emailService.sendCampaignApproved(campaign.createdBy, campaign);

        res.status(200).json({ status: 'success', message: 'Campaign approved successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.rejectCampaign = async (req, res) => {
    try {
        const { campaignId, adminRemarks } = req.body;
        const campaign = await Campaign.findById(campaignId).populate('createdBy', 'name email');
        if (!campaign) return res.status(404).json({ message: 'Campaign not found' });

        campaign.status = 'REJECTED';
        await campaign.save();

        // Create Audit Log
        await AuditLog.create({
            action: 'ADMIN_REJECTED_CAMPAIGN',
            performedBy: req.user.id,
            targetId: campaign._id,
            targetModel: 'Campaign',
            details: `Rejected campaign: ${campaign.title}. Reason: ${adminRemarks}`
        });

        // Create Notification
        if (campaign.createdByRole === 'NGO') {
            await notificationService.create(
                campaign.createdBy._id,
                'Campaign Rejected',
                `Your campaign "${campaign.title}" has been rejected. Reason: ${adminRemarks}`,
                'CAMPAIGN_REJECTED'
            );
        }

        // Send Email
        await emailService.sendCampaignRejected(campaign.createdBy, campaign, adminRemarks);

        res.status(200).json({ status: 'success', message: 'Campaign rejected successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Get all campaigns for admin (including pending/rejected)
 */
exports.getAllCampaignsForAdmin = async (req, res) => {
    try {
        const campaigns = await Campaign.find().sort('-createdAt').populate('createdBy', 'name organizationName');
        res.status(200).json({ status: 'success', data: { campaigns } });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Audit Logs
 */
exports.getAuditLogs = async (req, res) => {
    try {
        const logs = await AuditLog.find()
            .sort('-createdAt')
            .populate('performedBy', 'name role')
            .limit(100);
        res.status(200).json({ status: 'success', data: { logs } });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Get all users with search and filter
 */
exports.getAllUsers = async (req, res) => {
    try {
        const { search, role } = req.query;
        let query = {};

        if (role) query.role = role;
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        const users = await User.find(query).sort('-createdAt');
        res.status(200).json({ status: 'success', data: { users } });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Get detailed user info
 */
exports.getUserDetails = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const donations = await Donation.find({ userId: req.params.id, status: 'completed' }).populate('campaignId', 'title');
        
        res.status(200).json({ 
            status: 'success', 
            data: { user, donations } 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Get advanced analytics
 */
exports.getAdvancedAnalytics = async (req, res) => {
    try {
        const totalDonors = await User.countDocuments({ role: 'USER' });
        const totalCampaigns = await Campaign.countDocuments();
        const totalNGOs = await User.countDocuments({ role: 'NGO' });
        const pendingNGOs = await NGOApplication.countDocuments({ status: 'PENDING' });
        const pendingCampaigns = await Campaign.countDocuments({ status: 'PENDING' });
        
        // Monthly stats
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const monthlyStats = await Donation.aggregate([
            { $match: { status: 'completed', createdAt: { $gte: startOfMonth } } },
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: '$amount' },
                    count: { $sum: 1 }
                }
            }
        ]);

        // Campaign-wise distribution
        const campaignStats = await Campaign.find().select('title currentAmount').limit(5).sort('-currentAmount');

        // Monthly Trend (Last 6 months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        
        const trend = await Donation.aggregate([
            { $match: { status: 'completed', createdAt: { $gte: sixMonthsAgo } } },
            {
                $group: {
                    _id: { month: { $month: '$createdAt' }, year: { $year: '$createdAt' } },
                    amount: { $sum: '$amount' }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } }
        ]);

        res.status(200).json({
            status: 'success',
            data: {
                totalDonors,
                totalCampaigns,
                totalNGOs,
                pendingNGOs,
                pendingCampaigns,
                monthlyAmount: monthlyStats.length > 0 ? monthlyStats[0].totalAmount : 0,
                monthlyCount: monthlyStats.length > 0 ? monthlyStats[0].count : 0,
                campaignStats,
                trend
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Export donations to CSV
 */
exports.exportDonations = async (req, res) => {
    try {
        const donations = await Donation.find({ status: 'completed' })
            .populate('userId', 'name email')
            .populate('campaignId', 'title');

        const fields = [
            { label: 'Donor Name', value: 'userId.name' },
            { label: 'Donor Email', value: 'userId.email' },
            { label: 'Campaign', value: 'campaignId.title' },
            { label: 'Amount', value: 'amount' },
            { label: 'Payment ID', value: 'razorpay_payment_id' },
            { label: 'Date', value: (row) => new Date(row.createdAt).toLocaleDateString() }
        ];

        const json2csvParser = new Parser({ fields });
        const csv = json2csvParser.parse(donations);

        res.header('Content-Type', 'text/csv');
        res.attachment('donations_export.csv');
        return res.send(csv);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.toggleUserBlock = async (req, res) => {
    try {
        const { userId } = req.body;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });
        if (user.role === 'ADMIN') return res.status(400).json({ message: 'Cannot block admin' });
        user.isBlocked = !user.isBlocked;
        await user.save();

        // Audit Log
        await AuditLog.create({
            action: user.isBlocked ? 'USER_BLOCKED' : 'USER_ACTIVATED',
            performedBy: req.user.id,
            targetId: user._id,
            targetModel: 'User',
            details: `${user.isBlocked ? 'Blocked' : 'Activated'} user: ${user.email}`
        });

        res.status(200).json({ status: 'success', message: `User ${user.isBlocked ? 'blocked' : 'unblocked'}` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllDonations = async (req, res) => {
    try {
        const donations = await Donation.find().populate('userId', 'name email').populate('campaignId', 'title').sort('-createdAt');
        res.status(200).json({ status: 'success', data: { donations } });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

