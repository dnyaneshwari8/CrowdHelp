const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../utils/multerConfig');

router.use(protect);

router.get('/profile', userController.getProfile);
router.patch('/profile', upload.single('profileImage'), userController.updateProfile);
router.post('/favorites/toggle', userController.toggleFavorite);
router.get('/certificates', userController.getCertificates);

module.exports = router;
