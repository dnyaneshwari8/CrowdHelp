const multer = require('multer');
const { storage } = require('../config/cloudinary');

// Init upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 5000000 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|webp|pdf/;
        const mimetype = allowedTypes.test(file.mimetype);
        const extname = allowedTypes.test(file.originalname.toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Error: Only images (jpg, jpeg, png, webp) and PDFs are allowed!'));
    }
});

module.exports = upload;
