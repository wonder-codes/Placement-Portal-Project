const Student = require('../models/Student');
const User = require('../models/User');

// @desc    Get Placement Analytics
// @route   GET /api/tpo/analytics
// @access  Private (TPO)
const getAnalytics = async (req, res) => {
    try {
        const totalStudents = await Student.countDocuments();
        const placedStudents = await Student.countDocuments({ placementStatus: 'Placed' });

        // Department Heatmap
        const departmentStats = await Student.aggregate([
            {
                $group: {
                    _id: '$department',
                    total: { $sum: 1 },
                    placed: { $sum: { $cond: [{ $eq: ['$placementStatus', 'Placed'] }, 1, 0] } }
                }
            }
        ]);

        // Average Package
        // Need to join with Job to get package
        // This aggregation is a bit complex, simplifying for now:
        // Fetch all placed students, populate job, calculate avg.
        // Or better: aggregate on Application where status = Placed

        const placedApps = await Student.find({ placementStatus: 'Placed' }).populate('placedAt');
        let totalPackage = 0;
        let count = 0;
        placedApps.forEach(s => {
            if (s.placedAt && s.placedAt.package) {
                totalPackage += s.placedAt.package;
                count++;
            }
        });
        const avgPackage = count > 0 ? (totalPackage / count).toFixed(2) : 0;

        res.json({
            totalStudents,
            placedStudents,
            placementPercentage: totalStudents > 0 ? ((placedStudents / totalStudents) * 100).toFixed(1) : 0,
            departmentStats,
            avgPackage
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get unverified users
// @route   GET /api/tpo/users
// @access  Private (TPO)
const getUsersToVerify = async (req, res) => {
    try {
        const users = await User.find({ isVerified: false, role: { $ne: 'TPO' } }).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Verify user
// @route   PUT /api/tpo/verify/:id
// @access  Private (TPO)
const verifyUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            user.isVerified = true;
            await user.save();
            res.json({ message: 'User verified' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get all students with full details
const getStudents = async (req, res) => {
    try {
        const students = await Student.find({}).populate('user', 'name email isVerified');
        res.json(students);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update student placement status manually
const updateStudentStatus = async (req, res) => {
    try {
        const { placementStatus } = req.body;
        const student = await Student.findById(req.params.id);

        if (!student) return res.status(404).json({ message: 'Student not found' });

        student.placementStatus = placementStatus || student.placementStatus;
        await student.save();

        res.json(student);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { getAnalytics, getUsersToVerify, verifyUser, getStudents, updateStudentStatus };
