const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const cloudinary = require('cloudinary').v2;

/**
 * Generate a PDF receipt and upload to Cloudinary.
 * @param {Object} donation - The donation object from the database
 * @returns {Promise<string>} - The Cloudinary URL of the generated PDF
 */
const generateReceipt = async (donation) => {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({ margin: 50 });
            const fileName = `receipt_${donation._id}.pdf`;
            const tempPath = path.join(__dirname, '../receipts', fileName);

            // Pipe the PDF into a temporary file
            const stream = fs.createWriteStream(tempPath);
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

            stream.on('finish', async () => {
                try {
                    // Upload to Cloudinary
                    const result = await cloudinary.uploader.upload(tempPath, {
                        folder: 'crowdhelp_receipts',
                        public_id: fileName.split('.')[0],
                        resource_type: 'raw' // Important for PDFs
                    });

                    // Remove temporary file
                    fs.unlinkSync(tempPath);
                    
                    resolve(result.secure_url);
                } catch (uploadErr) {
                    reject(uploadErr);
                }
            });

            stream.on('error', (err) => {
                reject(err);
            });
        } catch (err) {
            reject(err);
        }
    });
};

module.exports = { generateReceipt };
