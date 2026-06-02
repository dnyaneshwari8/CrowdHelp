const express = require('express');
const router = express.Router();
const ngoApplicationController = require('../controllers/ngoApplicationController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../utils/multerConfig');

router.use(protect);

router.post('/apply', upload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'certificate', maxCount: 1 }
]), ngoApplicationController.submitApplication);

router.get('/my-application', ngoApplicationController.getMyApplication);

module.exports = router;
