const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

/**
 * Send a donation confirmation email with the PDF receipt attached.
 * @param {Object} donation - The donation details
 * @param {string} pdfPath - Path to the generated PDF receipt
 * @param {string} customMessage - Optional custom message (e.g. for OTP)
 */
const sendConfirmationEmail = async (donation, pdfPath, customMessage, subject) => {
    // Create a transporter using your email service
    const transporter = nodemailer.createTransport({
        service: 'gmail', // or your SMTP service
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: `"CrowdHelp" <${process.env.EMAIL_USER}>`,
        to: donation.donorEmail,
        subject: subject || (customMessage ? 'Verification Code' : 'Donation Successful - Receipt Attached'),
        text: customMessage || `Dear ${donation.donorName},\n\nThank you for your donation of ₹${donation.amount}. Please find your receipt attached to this email.\n\nPayment ID: ${donation.razorpay_payment_id}\n\nBest Regards,\nDonation Team`,
        attachments: pdfPath ? [
            {
                filename: `Receipt_${donation._id}.pdf`,
                path: pdfPath,
            },
        ] : [],
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Confirmation email sent to ${donation.donorEmail}`);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

module.exports = { sendConfirmationEmail };
