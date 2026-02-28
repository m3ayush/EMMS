const router = require('express').Router();
const authMiddleware = require('../middleware/authMiddleware');
const requireRole = require('../middleware/roleMiddleware');
const { uploadFile } = require('../controllers/uploadController');

router.use(authMiddleware, requireRole('faculty', 'senior'));

router.post('/file', uploadFile);

module.exports = router;
