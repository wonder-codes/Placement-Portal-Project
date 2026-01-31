const express = require('express');
const router = express.Router();
const { getStudentProfile, updateStudentProfile, getStudents } = require('../controllers/studentController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/profile', protect, authorize('Student'), getStudentProfile);
router.put('/profile', protect, authorize('Student'), updateStudentProfile);
router.get('/', protect, authorize('Recruiter', 'TPO'), getStudents);

module.exports = router;
