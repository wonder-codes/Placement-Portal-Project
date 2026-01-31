const Job = require('../models/Job');

// @desc    Create a job
// @route   POST /api/jobs
// @access  Private (Recruiter)
const createJob = async (req, res) => {
    try {
        const { companyName, role, description, package, eligibility, deadline } = req.body;

        const job = new Job({
            recruiter: req.user._id,
            companyName,
            role,
            description,
            package,
            eligibility,
            deadline
        });

        const createdJob = await job.save();

        // Notify students via Socket.io or Email? (Optional enhancement)

        res.status(201).json(createdJob);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Private (All)
const getJobs = async (req, res) => {
    try {
        const jobs = await Job.find({}).sort({ createdAt: -1 });
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get job by ID
// @route   GET /api/jobs/:id
// @access  Private (All)
const getJobById = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (job) {
            res.json(job);
        } else {
            res.status(404).json({ message: 'Job not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get jobs posted by current recruiter
// @route   GET /api/jobs/my
// @access  Private (Recruiter)
const getMyJobs = async (req, res) => {
    try {
        const jobs = await Job.find({ recruiter: req.user._id }).sort({ createdAt: -1 });
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { createJob, getJobs, getJobById, getMyJobs };
