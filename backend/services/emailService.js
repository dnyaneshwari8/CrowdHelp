const nodemailer = require('nodemailer');
const Notification = require('../models/Notification');
const path = require('path');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

/**
 * Reusable Email Service
 */
const emailService = {
    /**
     * Send email using a template
     */
    sendEmail: async (to, subject, html, attachments = []) => {
        const mailOptions = {
            from: `"Crowdfund Platform" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html,
            attachments
        };

        try {
            await transporter.sendMail(mailOptions);
            console.log(`Email sent to ${to}: ${subject}`);
            return true;
        } catch (error) {
            console.error(`Error sending email to ${to}:`, error);
            return false;
        }
    },

    /**
     * Get base HTML template
     */
    getTemplate: (title, content) => `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
            <div style="background-color: #22c55e; color: white; padding: 20px; text-align: center;">
                <h1 style="margin: 0;">${title}</h1>
            </div>
            <div style="padding: 30px; line-height: 1.6; color: #1e293b;">
                ${content}
            </div>
            <div style="background-color: #f8fafc; color: #64748b; padding: 20px; text-align: center; font-size: 12px;">
                <p>&copy; ${new Date().getFullYear()} Crowdfund Platform. All rights reserved.</p>
                <p>This is an automated email, please do not reply.</p>
            </div>
        </div>
    `,

    /**
     * 1. Registration Welcome Email
     */
    sendWelcomeEmail: async (user, otp) => {
        const content = `
            <p>Dear ${user.name},</p>
            <p>Welcome to our Crowdfund Platform! We're excited to have you join our community.</p>
            <div style="background-color: #f1f5f9; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
                <p style="margin-bottom: 10px;">Your Verification OTP:</p>
                <h2 style="font-size: 32px; color: #22c55e; margin: 0; letter-spacing: 5px;">${otp}</h2>
            </div>
            <p>Please use this OTP to verify your email address and start your journey with us.</p>
        `;
        const html = emailService.getTemplate('Welcome to Crowdfund!', content);
        return await emailService.sendEmail(user.email, 'Welcome to Crowdfund Platform', html);
    },

    /**
     * 2. Verification OTP Email
     */
    sendOTPEmail: async (email, otp) => {
        const content = `
            <p>Hello,</p>
            <p>You requested a verification code. Use the OTP below to proceed:</p>
            <div style="background-color: #f1f5f9; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
                <h2 style="font-size: 32px; color: #22c55e; margin: 0; letter-spacing: 5px;">${otp}</h2>
            </div>
            <p>This code will expire in 10 minutes.</p>
        `;
        const html = emailService.getTemplate('Verification Code', content);
        return await emailService.sendEmail(email, 'Your Verification Code', html);
    },

    /**
     * 3. Forgot Password Email
     */
    sendForgotPasswordEmail: async (email, otp) => {
        const content = `
            <p>Hello,</p>
            <p>We received a request to reset your password. Use the OTP below to reset it:</p>
            <div style="background-color: #f1f5f9; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
                <h2 style="font-size: 32px; color: #22c55e; margin: 0; letter-spacing: 5px;">${otp}</h2>
            </div>
            <p>If you didn't request this, you can safely ignore this email.</p>
        `;
        const html = emailService.getTemplate('Reset Password', content);
        return await emailService.sendEmail(email, 'Reset Password OTP', html);
    },

    /**
     * 4. NGO Application Submitted
     */
    sendNGOApplicationSubmitted: async (user) => {
        const content = `
            <p>Dear ${user.name},</p>
            <p>Your application to become an NGO partner has been successfully received.</p>
            <p><strong>Status:</strong> Pending Review</p>
            <p>Our team will review your documents and verify your organization. This process usually takes 2-3 business days.</p>
        `;
        const html = emailService.getTemplate('Application Received', content);
        return await emailService.sendEmail(user.email, 'NGO Application Received', html);
    },

    /**
     * 5. NGO Approved
     */
    sendNGOApproved: async (user) => {
        const content = `
            <p>Dear ${user.name},</p>
            <p>Congratulations! Your NGO application has been <strong>APPROVED</strong>.</p>
            <p>You can now access your NGO Dashboard to create campaigns and raise funds for your causes.</p>
            <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.FRONTEND_URL}/ngo/dashboard" style="background-color: #22c55e; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Go to Dashboard</a>
            </div>
        `;
        const html = emailService.getTemplate('Congratulations!', content);
        return await emailService.sendEmail(user.email, 'NGO Application Approved', html);
    },

    /**
     * 6. NGO Rejected
     */
    sendNGORejected: async (user, reason) => {
        const content = `
            <p>Dear ${user.name},</p>
            <p>Thank you for your interest in our platform. We regret to inform you that your NGO application has been <strong>REJECTED</strong>.</p>
            <p><strong>Reason:</strong> ${reason}</p>
            <p>You can update your profile with correct documents and try applying again.</p>
        `;
        const html = emailService.getTemplate('Application Status Update', content);
        return await emailService.sendEmail(user.email, 'NGO Application Update', html);
    },

    /**
     * 7. Campaign Approved
     */
    sendCampaignApproved: async (user, campaign) => {
        const content = `
            <p>Dear ${user.name},</p>
            <p>Good news! Your campaign <strong>"${campaign.title}"</strong> has been approved and is now LIVE.</p>
            <p>You can start sharing it with your network to raise funds.</p>
        `;
        const html = emailService.getTemplate('Campaign Approved', content);
        return await emailService.sendEmail(user.email, 'Campaign Approved - Live Now', html);
    },

    /**
     * 8. Campaign Rejected
     */
    sendCampaignRejected: async (user, campaign, reason) => {
        const content = `
            <p>Dear ${user.name},</p>
            <p>Your campaign <strong>"${campaign.title}"</strong> requires changes and has been rejected for now.</p>
            <p><strong>Reason:</strong> ${reason}</p>
            <p>Please edit the campaign details according to the feedback and resubmit for approval.</p>
        `;
        const html = emailService.getTemplate('Campaign Update', content);
        return await emailService.sendEmail(user.email, 'Campaign Approval Update', html);
    },

    /**
     * 9. Donation Success
     */
    sendDonationSuccess: async (donor, campaign, donation, receiptPath, certificatePath) => {
        const content = `
            <p>Dear ${donor.name},</p>
            <p>Thank you for your generous donation of <strong>₹${donation.amount}</strong> to <strong>"${campaign.title}"</strong>.</p>
            <div style="background-color: #f1f5f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 5px 0;"><strong>Donation ID:</strong> ${donation._id}</p>
                <p style="margin: 5px 0;"><strong>Amount:</strong> ₹${donation.amount}</p>
                <p style="margin: 5px 0;"><strong>Date:</strong> ${new Date(donation.createdAt).toLocaleDateString()}</p>
            </div>
            <p>Your donation receipt and certificate are attached to this email.</p>
            <p>Your support makes a real difference!</p>
        `;
        const html = emailService.getTemplate('Thank You!', content);
        
        const attachments = [];
        if (receiptPath) {
            attachments.push({
                filename: `Receipt_${donation._id}.pdf`,
                path: receiptPath
            });
        }
        if (certificatePath) {
            attachments.push({
                filename: `Certificate_${donation._id}.pdf`,
                path: certificatePath
            });
        }

        return await emailService.sendEmail(donor.email, 'Donation Successful - Receipt & Certificate Attached', html, attachments);
    },

    /**
     * 10. Campaign Goal Achieved
     */
    sendCampaignGoalAchieved: async (user, campaign) => {
        const content = `
            <p>Dear ${user.name},</p>
            <p>Incredible news! Your campaign <strong>"${campaign.title}"</strong> has reached its goal of <strong>₹${campaign.goalAmount}</strong>!</p>
            <p>Thank you for your dedication to this cause.</p>
        `;
        const html = emailService.getTemplate('Goal Achieved!', content);
        return await emailService.sendEmail(user.email, 'Congratulations! Campaign Goal Achieved', html);
    },

    /**
     * 11. Campaign Completed
     */
    sendCampaignCompleted: async (user, campaign) => {
        const content = `
            <p>Dear ${user.name},</p>
            <p>Your campaign <strong>"${campaign.title}"</strong> has been successfully completed.</p>
            <p>Final Amount Raised: <strong>₹${campaign.currentAmount}</strong></p>
        `;
        const html = emailService.getTemplate('Campaign Completed', content);
        return await emailService.sendEmail(user.email, 'Campaign Successfully Completed', html);
    }
};

/**
 * Reusable Notification Service
 */
const notificationService = {
    create: async (userId, title, message, type) => {
        try {
            const notification = await Notification.create({
                userId,
                title,
                message,
                type
            });
            return notification;
        } catch (error) {
            console.error('Error creating notification:', error);
            return null;
        }
    }
};

module.exports = { emailService, notificationService };
