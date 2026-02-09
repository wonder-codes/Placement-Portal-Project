const express = require('express');
const router = express.Router();
const { getAnalytics, getUsersToVerify, verifyUser, getStudents, updateStudentStatus } = require('../controllers/tpoController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/analytics', protect, authorize('TPO'), getAnalytics);
router.get('/users', protect, authorize('TPO'), getUsersToVerify);
router.put('/verify/:id', protect, authorize('TPO'), verifyUser);
router.get('/students', protect, authorize('TPO'), getStudents);
router.put('/students/:id', protect, authorize('TPO'), updateStudentStatus);

module.exports = router;
