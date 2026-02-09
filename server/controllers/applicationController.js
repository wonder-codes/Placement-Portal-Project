const Application = require('../models/Application');
const Job = require('../models/Job');
const Student = require('../models/Student');
const User = require('../models/User');
const Notification = require('../models/Notification');

// @desc    Apply for a job (Smart Eligibility Engine)
const applyForJob = async (req, res) => {
    try {
        const { jobId } = req.body;
        const student = await Student.findOne({ user: req.user._id });
        const job = await Job.findById(jobId);

        if (!student || !job) {
            return res.status(404).json({ message: 'Student or Job not found' });
        }

        // 1. One Student One Job Policy / Locking
        if (student.placementStatus === 'Placed' || student.placementStatus === 'Locked') {
            return res.status(400).json({ message: 'You are already placed or your status is locked. Policy restriction.' });
        }

        // 2. Check Verification
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
        if (job.eligibility.allowedBranches.length > 0 && !job.eligibility.allowedBranches.includes(student.department)) {
            return res.status(400).json({ message: `Your department (${student.department}) is not eligible for this job.` });
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

// @desc    Update application status & results (Recruiter/TPO)
const updateApplicationStatus = async (req, res) => {
    try {
        const { status, roundsProgress, testSchedule, interviewSchedule, offerDetails } = req.body;
        const application = await Application.findById(req.params.id)
            .populate({
                path: 'student',
                populate: { path: 'user', select: 'name email' }
            })
            .populate({
                path: 'job',
                populate: { path: 'company', select: 'name' }
            });

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        if (status) application.status = status;
        if (roundsProgress) application.roundsProgress = roundsProgress;
        if (testSchedule) application.testSchedule = testSchedule;
        if (interviewSchedule) application.interviewSchedule = interviewSchedule;
        if (offerDetails) application.offerDetails = offerDetails;

        await application.save();

        // Notification Logic
        if (status || testSchedule || interviewSchedule) {
            await Notification.create({
                user: application.student.user._id,
                title: `Update on your application: ${application.job.role}`,
                message: `Your application status for ${application.job.role} has been updated to ${status || 'Scheduled'}. Check portal for details.`,
                type: 'Application'
            });
        }

        // Specific Logic for Selection/Placement
        if (status === 'Selected') {
            // Student can now Accept/Reject offer
        }

        if (status === 'Offer Accepted') {
            const student = await Student.findById(application.student._id);
            student.placementStatus = 'Placed';
            student.placedAt = application.job._id;
            await student.save();

            // Emit Live Ticker Event
            const io = req.app.get('io');
            if (io) {
                io.emit('placement_update', {
                    studentName: application.student.user.name,
                    department: application.student.department,
                    company: application.job.company.name,
                    package: application.job.package
                });
            }
        }

        res.json(application);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get my applications
const getMyApplications = async (req, res) => {
    try {
        const student = await Student.findOne({ user: req.user._id });
        if (!student) return res.status(404).json({ message: 'Student profile missing' });

        const applications = await Application.find({ student: student._id })
            .populate({
                path: 'job',
                populate: { path: 'company', select: 'name' }
            });
        res.json(applications);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get applications for a job
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

const respondToOffer = async (req, res) => {
    try {
        const { response } = req.body; // 'Accepted' or 'Rejected'
        const application = await Application.findById(req.params.id)
            .populate('student')
            .populate({
                path: 'job',
                populate: { path: 'company', select: 'name' }
            });

        if (!application || application.student.user.toString() !== req.user._id.toString()) {
            return res.status(404).json({ message: 'Application not found' });
        }

        if (application.status !== 'Selected') {
            return res.status(400).json({ message: 'No offer to respond to' });
        }

        application.status = response === 'Accepted' ? 'Offer Accepted' : 'Offer Rejected';
        await application.save();

        if (response === 'Accepted') {
            const student = await Student.findById(application.student._id);
            student.placementStatus = 'Placed';
            student.placedAt = application.job._id;
            await student.save();

            // Lock other applications if one-offer policy
            // In a real app, you might cancel other pending applications
        }

        res.json(application);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { applyForJob, getJobApplications, getMyApplications, updateApplicationStatus, respondToOffer };
