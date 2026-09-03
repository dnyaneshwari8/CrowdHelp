const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const dotenv = require('dotenv');

dotenv.config();

const isCloudinaryConfigured = !!(
    process.env.CLOUDINARY_CLOUD_NAME && 
    process.env.CLOUDINARY_API_KEY && 
    process.env.CLOUDINARY_API_SECRET
);

if (isCloudinaryConfigured) {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    });
    console.log('--- CLOUDINARY CONFIG LOADED (Remote Storage Active) ---');
} else {
    console.log('--- CLOUDINARY NOT CONFIGURED: Falling back to Local Disk Storage (uploads/) ---');
}

let storage = null;
if (isCloudinaryConfigured) {
    storage = new CloudinaryStorage({
        cloudinary: cloudinary,
        params: {
            folder: 'crowdhelp_campaigns',
            allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
            transformation: [{ width: 1000, height: 600, crop: 'limit' }]
        }
    });
}

module.exports = {
    cloudinary,
    storage,
    isCloudinaryConfigured
};
