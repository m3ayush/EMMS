const router = require('express').Router();
const authMiddleware = require('../middleware/authMiddleware');
const requireRole = require('../middleware/roleMiddleware');
const { create, list, getById, update, renew, upcomingExpirations } = require('../controllers/mouController');

router.use(authMiddleware, requireRole('faculty', 'senior'));

router.post('/', create);
router.get('/', list);
router.get('/upcoming-expirations', upcomingExpirations);
router.get('/:id', getById);
router.put('/:id', update);
router.post('/:id/renew', renew);

module.exports = router;
