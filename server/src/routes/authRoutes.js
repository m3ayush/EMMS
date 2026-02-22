const router = require('express').Router();
const authMiddleware = require('../middleware/authMiddleware');
const { register, getMe, updateMe } = require('../controllers/authController');

router.post('/register', authMiddleware, register);
router.get('/me', authMiddleware, getMe);
router.put('/me', authMiddleware, updateMe);

module.exports = router;
