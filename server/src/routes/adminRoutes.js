const router = require('express').Router();
const authMiddleware = require('../middleware/authMiddleware');
const requireRole = require('../middleware/roleMiddleware');
const {
  dashboardStats,
  listFaculty,
  getFaculty,
  getFacultyMous,
  inactiveFaculty,
  getOrgMous,
  createGracePeriod,
  listGracePeriods,
  updateGracePeriod,
  myGracePeriods,
} = require('../controllers/adminController');

router.use(authMiddleware);

// Faculty can view their own grace periods
router.get('/grace-periods/my', requireRole('faculty', 'senior'), myGracePeriods);

// Senior-only routes
router.get('/dashboard/stats', requireRole('senior'), dashboardStats);
router.get('/faculty', requireRole('senior'), listFaculty);
router.get('/faculty/:id', requireRole('senior'), getFaculty);
router.get('/faculty/:id/mous', requireRole('senior'), getFacultyMous);
router.get('/inactive-faculty', requireRole('senior'), inactiveFaculty);
router.get('/organisations/:id/mous', requireRole('senior'), getOrgMous);
router.post('/grace-periods', requireRole('senior'), createGracePeriod);
router.get('/grace-periods', requireRole('senior'), listGracePeriods);
router.put('/grace-periods/:id', requireRole('senior'), updateGracePeriod);

module.exports = router;
