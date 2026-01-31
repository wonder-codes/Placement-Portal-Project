const express = require('express');
const router = express.Router();
const { createJob, getJobs, getJobById, getMyJobs } = require('../controllers/jobController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, authorize('Recruiter'), createJob)
    .get(protect, getJobs); // Students can see jobs

router.get('/my', protect, authorize('Recruiter'), getMyJobs);

router.route('/:id')
    .get(protect, getJobById);

module.exports = router;
