const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
    action: {
        type: String,
        required: true,
        enum: [
            'ADMIN_APPROVED_NGO',
            'ADMIN_REJECTED_NGO',
            'ADMIN_APPROVED_CAMPAIGN',
            'ADMIN_REJECTED_CAMPAIGN',
            'USER_BLOCKED',
            'USER_ACTIVATED'
        ]
    },
    performedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    targetId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    targetModel: {
        type: String,
        required: true,
        enum: ['User', 'Campaign', 'NGOApplication']
    },
    details: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('AuditLog', auditLogSchema);
