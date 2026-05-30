const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

/**
 * Generate a PDF receipt for a successful donation.
 * @param {Object} donation - The donation object from the database
 * @returns {Promise<string>} - The path to the generated PDF file
 */
const generateReceipt = (donation) => {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({ margin: 50 });
        const fileName = `receipt_${donation._id}.pdf`;
        const filePath = path.join(__dirname, '../receipts', fileName);

        // Pipe the PDF into a file
        const stream = fs.createWriteStream(filePath);
        doc.pipe(stream);

        // Add content to the PDF
        doc.fontSize(25).text('Donation Receipt', { align: 'center' });
        doc.moveDown();
        doc.fontSize(12).text('Thank you for your generous contribution!', { align: 'center' });
        doc.moveDown(2);

        doc.fontSize(14).text(`Receipt ID: ${donation._id}`);
        doc.text(`Date: ${new Date(donation.createdAt).toLocaleDateString()}`);
        doc.moveDown();

        doc.fontSize(16).text('Donor Details:', { underline: true });
        doc.fontSize(14).text(`Name: ${donation.donorName}`);
        doc.text(`Email: ${donation.donorEmail}`);
        doc.moveDown();

        doc.fontSize(16).text('Payment Details:', { underline: true });
        doc.fontSize(14).text(`Amount: ₹${donation.amount}`);
        doc.text(`Payment ID: ${donation.razorpay_payment_id}`);
        doc.text(`Order ID: ${donation.razorpay_order_id}`);
        doc.text(`Status: ${donation.status.toUpperCase()}`);

        doc.moveDown(3);
        doc.fontSize(10).text('This is a computer-generated receipt.', { align: 'center', italic: true });

        doc.end();

        stream.on('finish', () => {
            resolve(filePath);
        });

        stream.on('error', (err) => {
            reject(err);
        });
    });
};

module.exports = { generateReceipt };
