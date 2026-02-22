const router = require('express').Router();
const authMiddleware = require('../middleware/authMiddleware');
const requireRole = require('../middleware/roleMiddleware');
const { create, list, getByMou } = require('../controllers/activityController');

router.use(authMiddleware, requireRole('faculty', 'senior'));

router.post('/', create);
router.get('/', list);
router.get('/mou/:mouId', getByMou);

module.exports = router;
