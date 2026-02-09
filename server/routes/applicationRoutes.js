const express = require('express');
const router = express.Router();
const { applyForJob, getJobApplications, getMyApplications, updateApplicationStatus, respondToOffer } = require('../controllers/applicationController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, authorize('Student'), applyForJob);
router.get('/my', protect, authorize('Student'), getMyApplications);
router.get('/job/:jobId', protect, authorize('Recruiter', 'TPO'), getJobApplications);
router.put('/:id/status', protect, authorize('Recruiter', 'TPO'), updateApplicationStatus);
router.put('/:id/respond', protect, authorize('Student'), respondToOffer);

module.exports = router;
