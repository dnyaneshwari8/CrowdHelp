const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const dotenv = require('dotenv');

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

console.log('--- CLOUDINARY CONFIG LOADED ---');
console.log('Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME);
// Don't log the full secret for security, just check if it exists
console.log('API Key exists:', !!process.env.CLOUDINARY_API_KEY);
console.log('API Secret exists:', !!process.env.CLOUDINARY_API_SECRET);

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'crowdhelp_campaigns',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        transformation: [{ width: 1000, height: 600, crop: 'limit' }]
    }
});

module.exports = {
    cloudinary,
    storage
};
