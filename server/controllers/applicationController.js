const Application = require('../models/Application');
const Job = require('../models/Job');
const Student = require('../models/Student');
const User = require('../models/User');

// @desc    Apply for a job (Smart Eligibility Engine)
// @route   POST /api/applications
// @access  Private (Student)
const applyForJob = async (req, res) => {
    try {
        const { jobId } = req.body;
        const student = await Student.findOne({ user: req.user._id });
        const job = await Job.findById(jobId);

        if (!student || !job) {
            return res.status(404).json({ message: 'Student or Job not found' });
        }

        // 1. One Student One Job Policy
        if (student.placementStatus === 'Placed') {
            return res.status(400).json({ message: 'You are already placed. Policy restriction.' });
        }

        // 2. Check Verification (Optional based on requirements, assuming TPO verifies user)
        const user = await User.findById(req.user._id);
        if (!user.isVerified) {
            return res.status(400).json({ message: 'Your profile is not verified by TPO yet.' });
        }

        // 3. Smart Eligibility Check
        if (student.cgpa < job.eligibility.minCGPA) {
            return res.status(400).json({ message: `CGPA too low. Required: ${job.eligibility.minCGPA}` });
        }
        if (student.backlogs > job.eligibility.maxBacklogs) {
            return res.status(400).json({ message: `Too many backlogs. Max allowed: ${job.eligibility.maxBacklogs}` });
        }

        // 4. Check if already applied
        const existingApp = await Application.findOne({ student: student._id, job: jobId });
        if (existingApp) {
            return res.status(400).json({ message: 'Already applied for this job' });
        }

        const application = await Application.create({
            student: student._id,
            job: jobId,
            status: 'Applied'
        });

        res.status(201).json(application);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get applications for a specific job (Recruiter view)
// @route   GET /api/applications/job/:jobId
// @access  Private (Recruiter)
const getJobApplications = async (req, res) => {
    try {
        const applications = await Application.find({ job: req.params.jobId })
            .populate({
                path: 'student',
                populate: { path: 'user', select: 'name email' }
            });
        res.json(applications);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get my applications (Student view)
// @route   GET /api/applications/my
// @access  Private (Student)
const getMyApplications = async (req, res) => {
    try {
        const student = await Student.findOne({ user: req.user._id });
        if (!student) return res.status(404).json({ message: 'Student profile missing' });

        const applications = await Application.find({ student: student._id })
            .populate('job', 'companyName role status');
        res.json(applications);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update application status (Recruiter/TPO)
// @route   PUT /api/applications/:id/status
// @access  Private (Recruiter)
const updateApplicationStatus = async (req, res) => {
    try {
        const { status } = req.body; // 'Shortlisted', 'Interview', 'Placed', 'Rejected'
        const application = await Application.findById(req.params.id)
            .populate('student')
            .populate({
                path: 'student',
                populate: { path: 'user', select: 'name email' }
            })
            .populate('job');

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        application.status = status;
        await application.save();

        // If PLACED Logic
        if (status === 'Placed') {
            const student = await Student.findById(application.student._id);
            student.placementStatus = 'Placed';
            student.placedAt = application.job._id;
            await student.save();

            // Emit Socket Event for Live Ticker
            const io = req.app.get('io');
            if (io) {
                io.emit('placement_update', {
                    studentName: application.student.user.name,
                    department: application.student.department,
                    company: application.job.companyName,
                    package: application.job.package
                });
            }

            // TODO: Send Email Notification
            const sendEmail = require('../utils/emailService');
            sendEmail(
                application.student.user.email,
                'Congratulations! You are Placed',
                `Dear ${application.student.user.name},\nWe are happy to inform you that you have been placed at ${application.job.companyName} as ${application.job.role} with a package of ${application.job.package} LPA.\n\nBest Regards,\nTPO Team`
            );
        }

        res.json(application);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { applyForJob, getJobApplications, getMyApplications, updateApplicationStatus };
