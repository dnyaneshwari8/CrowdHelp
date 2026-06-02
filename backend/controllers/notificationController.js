const Notification = require('../models/Notification');

/**
 * Get all notifications for the current user
 */
exports.getNotifications = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const notifications = await Notification.find({ userId: req.user.id })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Notification.countDocuments({ userId: req.user.id });

        res.status(200).json({
            status: 'success',
            results: notifications.length,
            data: {
                notifications,
                pagination: {
                    total,
                    page,
                    pages: Math.ceil(total / limit)
                }
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Get unread notification count
 */
exports.getUnreadCount = async (req, res) => {
    try {
        const count = await Notification.countDocuments({ 
            userId: req.user.id, 
            isRead: false 
        });
        res.status(200).json({ status: 'success', count });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Mark a single notification as read
 */
exports.markAsRead = async (req, res) => {
    try {
        const notification = await Notification.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.id },
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
 * Mark all notifications as read
 */
exports.markAllRead = async (req, res) => {
    try {
        await Notification.updateMany(
            { userId: req.user.id, isRead: false },
            { isRead: true }
        );
        res.status(200).json({ status: 'success', message: 'All notifications marked as read' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Delete a notification
 */
exports.deleteNotification = async (req, res) => {
    try {
        const notification = await Notification.findOneAndDelete({ 
            _id: req.params.id, 
            userId: req.user.id 
        });

        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }

        res.status(204).json({ status: 'success', data: null });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
