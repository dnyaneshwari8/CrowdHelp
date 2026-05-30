const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

/**
 * Send a donation confirmation email with the PDF receipt attached.
 * @param {Object} donation - The donation details
 * @param {string} pdfPath - Path to the generated PDF receipt
 */
const sendConfirmationEmail = async (donation, pdfPath) => {
    // Create a transporter using your email service
    const transporter = nodemailer.createTransport({
        service: 'gmail', // or your SMTP service
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: `"Donation Project" <${process.env.EMAIL_USER}>`,
        to: donation.donorEmail,
        subject: 'Donation Successful - Receipt Attached',
        text: `Dear ${donation.donorName},\n\nThank you for your donation of ₹${donation.amount}. Please find your receipt attached to this email.\n\nPayment ID: ${donation.razorpay_payment_id}\n\nBest Regards,\nDonation Team`,
        attachments: [
            {
                filename: `Receipt_${donation._id}.pdf`,
                path: pdfPath,
            },
        ],
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Confirmation email sent to ${donation.donorEmail}`);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

module.exports = { sendConfirmationEmail };
