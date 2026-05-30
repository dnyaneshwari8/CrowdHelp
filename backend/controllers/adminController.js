const User = require('../models/User');
const Donation = require('../models/Donation');
const Campaign = require('../models/Campaign');
const { Parser } = require('json2csv');

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
