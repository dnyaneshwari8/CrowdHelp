const User = require('../models/User');
const Campaign = require('../models/Campaign');
const Donation = require('../models/Donation');
const CampaignUpdate = require('../models/CampaignUpdate');
const Notification = require('../models/Notification');
const { notificationService } = require('../services/emailService');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

/**
 * Get NGO dashboard stats
 */
exports.getDashboardStats = async (req, res) => {
    try {
        const ngoId = req.user.id;
        const ngoObjectId = new mongoose.Types.ObjectId(ngoId);

        const totalCampaigns = await Campaign.countDocuments({ createdBy: ngoId });
        const activeCampaigns = await Campaign.countDocuments({ createdBy: ngoId, status: 'APPROVED' });
        const pendingCampaigns = await Campaign.countDocuments({ createdBy: ngoId, status: 'PENDING' });
        const completedCampaigns = await Campaign.countDocuments({ createdBy: ngoId, status: 'COMPLETED' });

        const donationStats = await Donation.aggregate([
            { $match: { ngoId: ngoObjectId, status: 'completed' } },
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: '$amount' },
                    count: { $sum: 1 },
                    uniqueDonors: { $addToSet: '$userId' }
                }
            }
        ]);

        const campaignPerformance = await Campaign.find({ createdBy: ngoId })
            .select('title currentAmount goalAmount status')
            .sort('-currentAmount');

        // Recent Activity Feed
        const recentCampaigns = await Campaign.find({ createdBy: ngoId })
            .sort('-createdAt')
            .limit(5)
            .select('title status createdAt');

        const recentDonations = await Donation.find({ ngoId: req.user._id, status: 'completed' })
            .sort('-createdAt')
            .limit(5)
            .populate('campaignId', 'title')
            .populate('userId', 'name');

        const activities = [
            ...recentCampaigns.map(c => ({
                type: 'CAMPAIGN',
                action: c.status === 'PENDING' ? 'Created' : c.status,
                title: c.title,
                date: c.createdAt
            })),
            ...recentDonations.map(d => ({
                type: 'DONATION',
                action: 'Received',
                title: `${d.userId?.name || 'Anonymous'} donated to ${d.campaignId?.title}`,
                amount: d.amount,
                date: d.createdAt
            }))
        ].sort((a, b) => b.date - a.date).slice(0, 10);

        res.status(200).json({
            status: 'success',
            data: {
                totalCampaigns,
                activeCampaigns,
                pendingCampaigns,
                completedCampaigns,
                totalDonations: donationStats.length > 0 ? donationStats[0].count : 0,
                totalAmountRaised: donationStats.length > 0 ? donationStats[0].totalAmount : 0,
                totalDonors: donationStats.length > 0 ? donationStats[0].uniqueDonors.length : 0,
                campaignPerformance,
                recentActivity: activities
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Get NGO campaign analytics
 */
exports.getNGOAnalytics = async (req, res) => {
    try {
        const ngoId = req.user.id;
        const ngoObjectId = new mongoose.Types.ObjectId(ngoId);

        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        // Monthly Trend
        const monthlyTrend = await Donation.aggregate([
            { 
                $match: { 
                    ngoId: ngoObjectId, 
                    status: 'completed', 
                    createdAt: { $gte: sixMonthsAgo } 
                } 
            },
            {
                $group: {
                    _id: { 
                        month: { $month: '$createdAt' }, 
                        year: { $year: '$createdAt' } 
                    },
                    amount: { $sum: '$amount' }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } }
        ]);

        // Category Distribution
        const categoryDist = await Campaign.aggregate([
            { $match: { createdBy: ngoObjectId } },
            {
                $group: {
                    _id: '$category',
                    count: { $sum: 1 }
                }
            }
        ]);

        // Campaign Performance (Top 5)
        const performance = await Campaign.find({ createdBy: ngoId })
            .sort('-currentAmount')
            .limit(5)
            .select('title currentAmount goalAmount');

        // Category Wise Donations
        const categoryDonations = await Donation.aggregate([
            { $match: { ngoId: ngoObjectId, status: 'completed' } },
            {
                $lookup: {
                    from: 'campaigns',
                    localField: 'campaignId',
                    foreignField: '_id',
                    as: 'campaign'
                }
            },
            { $unwind: '$campaign' },
            {
                $group: {
                    _id: '$campaign.category',
                    totalAmount: { $sum: '$amount' }
                }
            }
        ]);

        res.status(200).json({
            status: 'success',
            data: { 
                monthlyTrend,
                categoryDist,
                performance,
                categoryDonations
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Update NGO profile details
 */
exports.updateNGOProfile = async (req, res) => {
    try {
        const {
            organizationName,
            organizationDescription,
            organizationPhone,
            registrationNumber,
            website,
            address
        } = req.body;

        const updateData = {
            organizationName,
            organizationDescription,
            organizationPhone,
            registrationNumber,
            website,
            address
        };

        if (req.file) {
            updateData.organizationLogo = `/uploads/${req.file.filename}`;
        }

        const user = await User.findByIdAndUpdate(req.user.id, updateData, {
            new: true,
            runValidators: true
        }).select('-password');

        res.status(200).json({
            status: 'success',
            data: { user }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Get donations received for NGO campaigns
 */
exports.getDonationsReceived = async (req, res) => {
    try {
        const { search, category, status, campaignId, page = 1, limit = 10 } = req.query;
        const skip = (page - 1) * limit;

        let query = { ngoId: req.user.id, status: 'completed' };

        if (campaignId) {
            query.campaignId = campaignId;
        }

        // Filtering logic can be expanded here
        
        const donations = await Donation.find(query)
            .sort('-createdAt')
            .skip(skip)
            .limit(Number(limit))
            .populate('campaignId', 'title category')
            .populate('userId', 'name email');

        const total = await Donation.countDocuments(query);
        
        res.status(200).json({ 
            status: 'success', 
            data: { 
                donations,
                pagination: {
                    total,
                    page: Number(page),
                    pages: Math.ceil(total / limit)
                }
            } 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Get NGO's own campaigns
 */
exports.getMyCampaigns = async (req, res) => {
    try {
        const campaigns = await Campaign.find({ createdBy: req.user.id }).sort('-createdAt');
        res.status(200).json({ status: 'success', data: { campaigns } });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Create NGO Campaign
 */
exports.createNGOCampaign = async (req, res) => {
    try {
        const { title, description, category, goalAmount, startDate, endDate } = req.body;

        if (!req.file) {
            return res.status(400).json({ message: 'Please upload a campaign image' });
        }

        const campaign = await Campaign.create({
            title,
            description,
            category,
            goalAmount: Number(goalAmount),
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            image: `/uploads/${req.file.filename}`,
            createdBy: req.user.id,
            createdByRole: 'NGO',
            ngoId: req.user.id,
            status: 'PENDING'
        });

        // Notify Admins
        const admins = await User.find({ role: 'ADMIN' });
        for (const admin of admins) {
            await notificationService.create(
                admin._id,
                'New Campaign Approval Required',
                `NGO "${req.user.organizationName}" has submitted a new campaign "${title}" for approval.`,
                'ADMIN_ACTION'
            );
        }

        res.status(201).json({ status: 'success', data: { campaign } });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Update NGO Campaign
 */
exports.updateNGOCampaign = async (req, res) => {
    try {
        const campaign = await Campaign.findOne({ _id: req.params.id, createdBy: req.user.id });
        
        if (!campaign) {
            return res.status(404).json({ message: 'Campaign not found or unauthorized' });
        }

        let updateData = { ...req.body };
        if (req.file) {
            updateData.image = `/uploads/${req.file.filename}`;
        }

        const updatedCampaign = await Campaign.findByIdAndUpdate(req.params.id, updateData, {
            new: true,
            runValidators: true
        });

        res.status(200).json({ status: 'success', data: { campaign: updatedCampaign } });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Delete NGO Campaign
 */
exports.deleteNGOCampaign = async (req, res) => {
    try {
        const campaign = await Campaign.findOneAndDelete({ _id: req.params.id, createdBy: req.user.id });
        
        if (!campaign) {
            return res.status(404).json({ message: 'Campaign not found or unauthorized' });
        }

        res.status(204).json({ status: 'success', data: null });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Post Campaign Update
 */
exports.postCampaignUpdate = async (req, res) => {
    try {
        const { campaignId, title, content } = req.body;

        if (!campaignId || !title || !content) {
            return res.status(400).json({ message: 'Please provide campaignId, title, and content' });
        }

        // Validate campaignId format
        if (!mongoose.Types.ObjectId.isValid(campaignId)) {
            return res.status(400).json({ message: 'Invalid campaign ID format' });
        }

        const campaign = await Campaign.findOne({ _id: campaignId, createdBy: req.user.id });
        if (!campaign) {
            return res.status(404).json({ message: 'Campaign not found or you do not have permission to post updates for it' });
        }

        const update = await CampaignUpdate.create({
            campaignId,
            ngoId: req.user.id,
            title,
            content
        });

        res.status(201).json({ status: 'success', data: { update } });
    } catch (error) {
        console.error('Post Campaign Update Error:', error);
        res.status(500).json({ message: error.message });
    }
};

/**
 * Get NGO Updates
 */
exports.getNGOUpdates = async (req, res) => {
    try {
        const updates = await CampaignUpdate.find({ ngoId: req.user.id })
            .sort('-createdAt')
            .populate('campaignId', 'title');
        
        res.status(200).json({ status: 'success', data: { updates } });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Delete Campaign Update
 */
exports.deleteNGOUpdate = async (req, res) => {
    try {
        const update = await CampaignUpdate.findOneAndDelete({ 
            _id: req.params.id, 
            ngoId: req.user.id 
        });

        if (!update) {
            return res.status(404).json({ message: 'Update not found or unauthorized' });
        }

        res.status(204).json({ status: 'success', data: null });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Get NGO Notifications
 */
exports.getNGONotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ recipient: req.user.id })
            .sort('-createdAt')
            .limit(50);
        
        res.status(200).json({ status: 'success', data: { notifications } });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Mark Notification as Read
 */
exports.markNotificationRead = async (req, res) => {
    try {
        const notification = await Notification.findOneAndUpdate(
            { _id: req.params.id, recipient: req.user.id },
            { isRead: true },
            { new: true }
        );

        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }

        res.status(200).json({ status: 'success', data: { notification } });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Get NGO Documents
 */
exports.getNGODocuments = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('organizationLogo registrationNumber');
        // This is a simplified version. In a real app, you might have a separate documents array in User model.
        res.status(200).json({ 
            status: 'success', 
            data: { 
                logo: user.organizationLogo,
                registrationNumber: user.registrationNumber
            } 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

