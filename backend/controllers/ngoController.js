const User = require('../models/User');
const Campaign = require('../models/Campaign');
const Donation = require('../models/Donation');

/**
 * Get NGO dashboard stats
 */
exports.getDashboardStats = async (req, res) => {
    try {
        const ngoId = req.user._id;

        const totalCampaigns = await Campaign.countDocuments({ createdBy: ngoId });
        const activeCampaigns = await Campaign.countDocuments({ createdBy: ngoId, status: 'APPROVED' });

        // Monthly stats for growth calculation
        const now = new Date();
        const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

        const currentMonthStats = await Donation.aggregate([
            { $match: { ngoId: ngoId, status: 'completed', createdAt: { $gte: startOfCurrentMonth } } },
            { $group: { _id: null, amount: { $sum: '$amount' }, count: { $sum: 1 } } }
        ]);

        const lastMonthStats = await Donation.aggregate([
            { $match: { ngoId: ngoId, status: 'completed', createdAt: { $gte: startOfLastMonth, $lt: startOfCurrentMonth } } },
            { $group: { _id: null, amount: { $sum: '$amount' }, count: { $sum: 1 } } }
        ]);

        const currentMonthAmount = currentMonthStats.length > 0 ? currentMonthStats[0].amount : 0;
        const lastMonthAmount = lastMonthStats.length > 0 ? lastMonthStats[0].amount : 0;
        
        let growth = 0;
        if (lastMonthAmount > 0) {
            growth = ((currentMonthAmount - lastMonthAmount) / lastMonthAmount) * 100;
        } else if (currentMonthAmount > 0) {
            growth = 100;
        }

        const donationStats = await Donation.aggregate([
            { $match: { ngoId: ngoId, status: 'completed' } },
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: '$amount' },
                    count: { $sum: 1 },
                    uniqueDonors: { $addToSet: '$userId' }
                }
            }
        ]);

        const uniqueDonorCount = donationStats.length > 0 ? donationStats[0].uniqueDonors.length : 0;

        const campaignPerformance = await Campaign.find({ createdBy: ngoId })
            .select('title currentAmount goalAmount status image')
            .sort('-currentAmount')
            .limit(5);

        // Recent Donations
        const recentDonations = await Donation.find({ ngoId, status: 'completed' })
            .sort('-createdAt')
            .limit(5)
            .populate('userId', 'name email')
            .populate('campaignId', 'title');

        // Monthly Trend (Last 6 months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        
        const trend = await Donation.aggregate([
            { $match: { ngoId, status: 'completed', createdAt: { $gte: sixMonthsAgo } } },
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
                totalCampaigns,
                activeCampaigns,
                totalDonations: donationStats.length > 0 ? donationStats[0].count : 0,
                uniqueDonors: uniqueDonorCount,
                totalAmountRaised: donationStats.length > 0 ? donationStats[0].totalAmount : 0,
                monthlyGrowth: growth.toFixed(1),
                currentMonthDonations: currentMonthStats.length > 0 ? currentMonthStats[0].count : 0,
                campaignPerformance,
                recentDonations,
                trend
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
        const ngoId = req.user._id;

        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        // Monthly Trend
        const monthlyTrend = await Donation.aggregate([
            { 
                $match: { 
                    ngoId: ngoId, 
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
            { $match: { createdBy: req.user._id } },
            {
                $group: {
                    _id: '$category',
                    count: { $sum: 1 }
                }
            }
        ]);

        // Campaign Performance (Top 5)
        const performance = await Campaign.find({ createdBy: req.user._id })
            .sort('-currentAmount')
            .limit(5)
            .select('title currentAmount goalAmount');

        res.status(200).json({
            status: 'success',
            data: { 
                monthlyTrend: monthlyTrend || [],
                categoryDist: categoryDist || [],
                performance: performance || []
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
            website
        } = req.body;

        const updateData = {
            organizationName,
            organizationDescription,
            organizationPhone,
            website
        };

        if (req.file) {
            updateData.organizationLogo = req.file.path;
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
        const donations = await Donation.find({ ngoId: req.user._id, status: 'completed' })
            .sort('-createdAt')
            .populate('campaignId', 'title')
            .populate('userId', 'name email');
        
        res.status(200).json({ status: 'success', data: { donations } });
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
 * Get NGO documents (Applications and uploaded files)
 */
exports.getNGODocuments = async (req, res) => {
    try {
        const NGOApplication = require('../models/NGOApplication');
        const applications = await NGOApplication.find({ userId: req.user._id }).sort('-createdAt');
        
        res.status(200).json({
            status: 'success',
            data: { applications }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getDashboardStats: exports.getDashboardStats,
    getNGOAnalytics: exports.getNGOAnalytics,
    getMyCampaigns: exports.getMyCampaigns,
    getDonationsReceived: exports.getDonationsReceived,
    updateNGOProfile: exports.updateNGOProfile,
    getNGODocuments: exports.getNGODocuments
};
