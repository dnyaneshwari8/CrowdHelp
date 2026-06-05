const User = require('../models/User');
const Donation = require('../models/Donation');
const Campaign = require('../models/Campaign');
const NGOApplication = require('../models/NGOApplication');
const AuditLog = require('../models/AuditLog');
const Notification = require('../models/Notification');
const { Parser } = require('json2csv');
const { sendConfirmationEmail } = require('../utils/emailSender');

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
        await Notification.create({
            recipient: user._id,
            title: 'NGO Application Approved',
            message: `Congratulations! Your NGO application for "${application.organizationName}" has been approved.`,
            type: 'APPLICATION_STATUS',
            relatedId: application._id,
            relatedModel: 'NGOApplication'
        });

        // Send Email
        await sendConfirmationEmail(
            { donorEmail: user.email, donorName: user.name },
            null,
            `Congratulations! Your NGO application for "${application.organizationName}" has been approved. You can now access the NGO dashboard and start creating campaigns.`,
            'NGO Application Approved'
        );

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
        await Notification.create({
            recipient: user._id,
            title: 'NGO Application Rejected',
            message: `Your NGO application for "${application.organizationName}" has been rejected. Reason: ${adminRemarks}`,
            type: 'APPLICATION_STATUS',
            relatedId: application._id,
            relatedModel: 'NGOApplication'
        });

        // Send Email
        await sendConfirmationEmail(
            { donorEmail: user.email, donorName: user.name },
            null,
            `We regret to inform you that your NGO application for "${application.organizationName}" has been rejected.\n\nReason: ${adminRemarks}`,
            'NGO Application Rejected'
        );

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
        await Notification.create({
            recipient: campaign.createdBy._id,
            title: 'Campaign Approved',
            message: `Your campaign "${campaign.title}" has been approved and is now live!`,
            type: 'CAMPAIGN_APPROVED',
            relatedId: campaign._id,
            relatedModel: 'Campaign'
        });

        // Send Email
        await sendConfirmationEmail(
            { donorEmail: campaign.createdBy.email, donorName: campaign.createdBy.name },
            null,
            `Great news! Your campaign "${campaign.title}" has been approved and is now live on the platform.`,
            'Campaign Approved'
        );

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
        await Notification.create({
            recipient: campaign.createdBy._id,
            title: 'Campaign Rejected',
            message: `Your campaign "${campaign.title}" was rejected. Reason: ${adminRemarks}`,
            type: 'CAMPAIGN_REJECTED',
            relatedId: campaign._id,
            relatedModel: 'Campaign'
        });

        // Send Email
        await sendConfirmationEmail(
            { donorEmail: campaign.createdBy.email, donorName: campaign.createdBy.name },
            null,
            `Your campaign "${campaign.title}" has been rejected.\n\nReason: ${adminRemarks}`,
            'Campaign Rejected'
        );

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
        // Total Donors: For now, count all registered users with role 'USER' as potential donors
        const totalDonors = await User.countDocuments({ role: 'USER' });

        const totalCampaigns = await Campaign.countDocuments({ status: { $in: ['APPROVED', 'COMPLETED'] } });
        const totalNGOs = await User.countDocuments({ role: 'NGO', ngoStatus: 'APPROVED' });
        const pendingNGOs = await NGOApplication.countDocuments({ status: 'PENDING' });
        const pendingCampaigns = await Campaign.countDocuments({ status: 'PENDING' });
        
        // Monthly stats (Current Month)
        const now = new Date();
        const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

        const monthlyStats = await Donation.aggregate([
            { $match: { status: 'completed', createdAt: { $gte: startOfCurrentMonth } } },
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: '$amount' },
                    count: { $sum: 1 }
                }
            }
        ]);

        const lastMonthlyStats = await Donation.aggregate([
            { $match: { 
                status: 'completed', 
                createdAt: { $gte: startOfLastMonth, $lt: startOfCurrentMonth } 
            } },
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: '$amount' },
                    count: { $sum: 1 }
                }
            }
        ]);

        const currentMonthAmount = monthlyStats.length > 0 ? monthlyStats[0].totalAmount : 0;
        const lastMonthAmount = lastMonthlyStats.length > 0 ? lastMonthlyStats[0].totalAmount : 0;
        
        // Calculate Growth Percentage
        let growth = 0;
        if (lastMonthAmount > 0) {
            growth = ((currentMonthAmount - lastMonthAmount) / lastMonthAmount) * 100;
        } else if (currentMonthAmount > 0) {
            growth = 100; // 100% growth if there were no donations last month
        }

        // Campaign-wise distribution
        const campaignStats = await Campaign.find().select('title currentAmount goalAmount').limit(5).sort('-currentAmount');

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
                totalDonors: totalDonors || 0,
                totalCampaigns: totalCampaigns || 0,
                totalNGOs: totalNGOs || 0,
                pendingNGOs: pendingNGOs || 0,
                pendingCampaigns: pendingCampaigns || 0,
                monthlyAmount: currentMonthAmount || 0,
                monthlyCount: monthlyStats.length > 0 ? monthlyStats[0].count : 0,
                monthlyGrowth: growth.toFixed(1),
                campaignStats: campaignStats || [],
                trend: trend || []
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

