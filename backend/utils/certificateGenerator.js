const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const cloudinary = require('cloudinary').v2;

/**
 * Generate a Donation Certificate PDF and upload to Cloudinary.
 * @param {Object} donation - The donation object
 * @param {Object} campaign - The campaign object
 * @returns {Promise<string>} - The Cloudinary URL of the generated PDF
 */
const generateCertificate = async (donation, campaign) => {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({ 
                layout: 'landscape',
                size: 'A4',
                margin: 50 
            });
            
            const fileName = `certificate_${donation._id}.pdf`;
            const tempPath = path.join(__dirname, '../certificates', fileName);

            const stream = fs.createWriteStream(tempPath);
            doc.pipe(stream);

            // Background / Border
            doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40).lineWidth(5).stroke('#646cff');
            doc.rect(30, 30, doc.page.width - 60, doc.page.height - 60).lineWidth(2).stroke('#646cff');

            // Header
            doc.fontSize(40).fillColor('#646cff').text('CERTIFICATE OF APPRECIATION', { align: 'center', underline: true });
            doc.moveDown(1.5);

            // Body
            doc.fontSize(20).fillColor('#333').text('This certificate is proudly presented to', { align: 'center' });
            doc.moveDown(0.5);
            
            doc.fontSize(35).fillColor('#000').text(donation.donorName, { align: 'center', font: 'Helvetica-Bold' });
            doc.moveDown(0.5);

            doc.fontSize(20).fillColor('#333').text(`for their generous donation of ₹${donation.amount}`, { align: 'center' });
            doc.moveDown(0.5);
            
            doc.fontSize(18).text(`towards the campaign:`, { align: 'center' });
            doc.fontSize(22).fillColor('#646cff').text(campaign?.title || 'General Fund', { align: 'center', font: 'Helvetica-Bold' });
            doc.moveDown(1.5);

            // Footer Details
            doc.fontSize(14).fillColor('#555');
            doc.text(`Certificate ID: ${donation._id}`, 100, 480);
            doc.text(`Date: ${new Date(donation.createdAt).toLocaleDateString()}`, 100, 505);

            doc.text('Authorized Signature', 600, 480);
            doc.moveTo(550, 475).lineTo(750, 475).stroke();

            doc.fontSize(12).fillColor('#888').text('Thank you for making a difference!', { align: 'center', bottom: 50 });

            doc.end();

            stream.on('finish', async () => {
                try {
                    // Upload to Cloudinary
                    const result = await cloudinary.uploader.upload(tempPath, {
                        folder: 'crowdhelp_certificates',
                        public_id: fileName.split('.')[0],
                        resource_type: 'raw'
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

module.exports = { generateCertificate };
