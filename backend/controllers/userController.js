const User = require('../models/User');
const Donation = require('../models/Donation');

/**
 * Get current user profile with stats
 */
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .populate('favorites', 'title image category goalAmount currentAmount description')
            .select('-password -otp -otpExpires');

        const stats = await Donation.aggregate([
            { $match: { userId: user._id, status: 'completed' } },
            {
                $group: {
                    _id: null,
                    totalDonated: { $sum: '$amount' },
                    count: { $sum: 1 }
                }
            }
        ]);

        res.status(200).json({
            status: 'success',
            data: {
                user,
                stats: stats.length > 0 ? stats[0] : { totalDonated: 0, count: 0 }
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Update user profile
 */
exports.updateProfile = async (req, res) => {
    try {
        const { name, phone } = req.body;
        let updateData = { name, phone };

        if (req.file) {
            updateData.profileImage = `/uploads/${req.file.filename}`;
        }

        const user = await User.findByIdAndUpdate(req.user.id, updateData, {
            new: true,
            runValidators: true
        }).select('-password');

        res.status(200).json({ status: 'success', data: { user } });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Add/Remove campaign from favorites
 */
exports.toggleFavorite = async (req, res) => {
    try {
        const { campaignId } = req.body;
        const user = await User.findById(req.user.id);

        const isFavorite = user.favorites.some(id => id.toString() === campaignId);

        if (isFavorite) {
            user.favorites.pull(campaignId);
        } else {
            user.favorites.push(campaignId);
        }

        await user.save();

        res.status(200).json({
            status: 'success',
            message: isFavorite ? 'Removed from favorites' : 'Added to favorites',
            isFavorite: !isFavorite
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Get user certificates
 */
exports.getCertificates = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('certificates');
        
        const donations = await Donation.find({
            _id: { $in: user.certificates },
            status: 'completed'
        }).populate('campaignId', 'title');

        res.status(200).json({ status: 'success', data: { certificates: donations } });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
