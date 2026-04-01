const router = require('express').Router();
const authMiddleware = require('../middleware/authMiddleware');
const requireRole = require('../middleware/roleMiddleware');
const { uploadFile, uploadActivityFile } = require('../controllers/uploadController');

router.use(authMiddleware, requireRole('faculty', 'senior'));

router.post('/file', uploadFile);
router.post('/activity-file', uploadActivityFile);

module.exports = router;
