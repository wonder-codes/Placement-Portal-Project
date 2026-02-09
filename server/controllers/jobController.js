const Job = require('../models/Job');
const Company = require('../models/Company');

// @desc    Create a job
// @route   POST /api/jobs
const createJob = async (req, res) => {
    try {
        const { role, description, package, eligibility, rounds, jobType, location, bond, deadline } = req.body;

        let companyId;
        if (req.user.role === 'Recruiter') {
            const company = await Company.findOne({ createdBy: req.user._id });
            if (!company) return res.status(400).json({ message: 'Create company profile first' });
            companyId = company._id;
        } else {
            companyId = req.body.companyId;
        }

        const job = new Job({
            recruiter: req.user._id,
            company: companyId,
            role,
            description,
            package,
            eligibility,
            rounds,
            jobType,
            location,
            bond,
            deadline,
            status: 'DRAFT'
        });

        const createdJob = await job.save();
        res.status(201).json(createdJob);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get all jobs (with company details)
const getJobs = async (req, res) => {
    try {
        let filter = { isActive: true };
        if (req.user.role === 'Student') {
            filter.status = 'PUBLISHED';
        }
        const jobs = await Job.find(filter)
            .populate('company', 'name description location logo')
            .sort({ createdAt: -1 });
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get job by ID
const getJobById = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id)
            .populate('company', 'name description website location logo hrContact status')
            .populate('recruiter', 'name email');

        if (!job) return res.status(404).json({ message: 'Job not found' });

        // Access Control
        if (req.user.role === 'Recruiter' && job.recruiter.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized to view this job' });
        }

        // Student can only see PUBLISHED
        if (req.user.role === 'Student' && job.status !== 'PUBLISHED') {
            return res.status(401).json({ message: 'Job not published' });
        }

        res.json(job);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update a job
const updateJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) return res.status(404).json({ message: 'Job not found' });

        // Ownership check
        if (req.user.role === 'Recruiter' && job.recruiter.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        // Recruiter can only edit in DRAFT
        if (req.user.role === 'Recruiter' && job.status !== 'DRAFT' && !req.body.status) {
            return res.status(400).json({ message: 'Cannot edit published or pending jobs' });
        }

        // Specific logic for status updates
        if (req.body.status) {
            if (req.user.role === 'Recruiter') {
                // Recruiter can only move DRAFT -> PENDING_APPROVAL or CLOSED
                if (!['DRAFT', 'PENDING_APPROVAL', 'CLOSED'].includes(req.body.status)) {
                    return res.status(400).json({ message: 'Invalid status transition for recruiter' });
                }
            }
            // TPO can move to PUBLISHED
        }

        Object.assign(job, req.body);
        const updatedJob = await job.save();
        res.json(updatedJob);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete/Deactivate a job
const deleteJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) return res.status(404).json({ message: 'Job not found' });

        if (req.user.role === 'Recruiter' && job.recruiter.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        job.isActive = false;
        job.status = 'CLOSED';
        await job.save();
        res.json({ message: 'Job closed' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get my jobs (Recruiter/TPO)
const getMyJobs = async (req, res) => {
    try {
        const query = req.user.role === 'TPO' ? {} : { recruiter: req.user._id };
        const jobs = await Job.find(query)
            .populate('company', 'name logo')
            .sort({ createdAt: -1 });
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { createJob, getJobs, getJobById, getMyJobs, updateJob, deleteJob };
