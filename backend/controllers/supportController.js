const SupportMessage = require('../models/SupportMessage');
const AuditLog = require('../models/AuditLog');

/**
 * Submit a support message
 */
exports.submitSupportMessage = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        const supportData = {
            name,
            email,
            subject,
            message,
            userId: req.user ? req.user.id : null
        };

        const supportMessage = await SupportMessage.create(supportData);

        res.status(201).json({
            status: 'success',
            message: 'Support message submitted successfully. We will get back to you soon.',
            data: { supportMessage }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Get all support messages (Admin Only)
 */
exports.getAllSupportMessages = async (req, res) => {
    try {
        const messages = await SupportMessage.find().sort('-createdAt').populate('userId', 'name email');
        res.status(200).json({ status: 'success', data: { messages } });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Update support message status (Admin Only)
 */
exports.updateMessageStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const message = await SupportMessage.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        );

        if (!message) {
            return res.status(404).json({ message: 'Support message not found' });
        }

        res.status(200).json({ status: 'success', data: { message } });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
