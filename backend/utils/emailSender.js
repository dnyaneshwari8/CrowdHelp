const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

/**
 * Send an email or simulate sending if SMTP credentials are not configured.
 * @param {Object} donation - Details with donorEmail / donorName
 * @param {string} pdfPath - Optional Path to generated PDF receipt
 * @param {string} customMessage - Optional custom message (e.g. for OTP)
 * @param {string} subject - Email subject
 */
const sendConfirmationEmail = async (donation, pdfPath, customMessage, subject) => {
    const targetEmail = donation?.donorEmail || donation?.email;
    const targetName = donation?.donorName || donation?.name || 'User';
    const emailSubject = subject || (customMessage ? 'CrowdHelp Notification' : 'Donation Successful - Receipt Attached');
    const emailBody = customMessage || `Dear ${targetName},\n\nThank you for your donation of ₹${donation?.amount || ''}. Please find your receipt attached to this email.\n\nPayment ID: ${donation?.razorpay_payment_id || 'N/A'}\n\nBest Regards,\nCrowdHelp Team`;

    // If SMTP is not configured, simulate email sending with console logging
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.log('\n[Email Service - Simulated Mock Email]');
        console.log(` To: ${targetEmail} (${targetName})`);
        console.log(` Subject: ${emailSubject}`);
        console.log(` Message: ${emailBody}`);
        if (pdfPath) console.log(` Attachment: ${pdfPath}`);
        console.log('------------------------------------\n');
        return { simulated: true, success: true };
    }

    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: `"CrowdHelp" <${process.env.EMAIL_USER}>`,
            to: targetEmail,
            subject: emailSubject,
            text: emailBody,
            attachments: pdfPath ? [
                {
                    filename: `Receipt_${donation._id || Date.now()}.pdf`,
                    path: pdfPath,
                },
            ] : [],
        };

        console.log(`[Email Sender] Sending email to ${targetEmail}...`);
        await transporter.sendMail(mailOptions);
        console.log(`[Email Sender] Email sent successfully to ${targetEmail}`);
        return { success: true };
    } catch (error) {
        console.warn(`[Email Sender Warning] Could not send via SMTP (${error.message}). Logged to console instead.`);
        console.log(`[Email Content for ${targetEmail}]: ${emailBody}`);
        return { success: false, error: error.message };
    }
};

module.exports = { sendConfirmationEmail };
