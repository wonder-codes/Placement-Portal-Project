const express = require('express');
const router = express.Router();
const { createJob, getJobs, getJobById, getMyJobs, updateJob, deleteJob } = require('../controllers/jobController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, authorize('Recruiter', 'TPO'), createJob)
    .get(protect, getJobs);

router.get('/my', protect, authorize('Recruiter', 'TPO'), getMyJobs);

router.route('/:id')
    .get(protect, getJobById)
    .put(protect, authorize('Recruiter', 'TPO'), updateJob)
    .delete(protect, authorize('TPO'), deleteJob);

module.exports = router;
