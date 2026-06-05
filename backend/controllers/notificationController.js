const Notification = require('../models/Notification');

exports.getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ recipient: req.user.id })
            .sort('-createdAt')
            .limit(20);
        
        const unreadCount = await Notification.countDocuments({ 
            recipient: req.user.id, 
            isRead: false 
        });

        res.status(200).json({ 
            status: 'success', 
            data: { notifications, unreadCount } 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.markAsRead = async (req, res) => {
    try {
        await Notification.updateMany(
            { recipient: req.user.id, isRead: false },
            { isRead: true }
        );
        res.status(200).json({ status: 'success', message: 'Notifications marked as read' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.markOneAsRead = async (req, res) => {
    try {
        const notification = await Notification.findOneAndUpdate(
            { _id: req.params.id, recipient: req.user.id },
            { isRead: true },
            { new: true }
        );
        if (!notification) return res.status(404).json({ message: 'Notification not found' });
        res.status(200).json({ status: 'success', data: { notification } });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
