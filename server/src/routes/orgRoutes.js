const router = require('express').Router();
const authMiddleware = require('../middleware/authMiddleware');
const requireRole = require('../middleware/roleMiddleware');
const { create, search, getById, update } = require('../controllers/orgController');

router.use(authMiddleware);

router.post('/', requireRole('faculty', 'senior'), create);
router.get('/', search);
router.get('/:id', getById);
router.put('/:id', requireRole('faculty', 'senior'), update);

module.exports = router;
