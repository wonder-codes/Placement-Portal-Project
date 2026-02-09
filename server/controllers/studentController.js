const Student = require('../models/Student');
const User = require('../models/User');

// @desc    Get current student profile
// @route   GET /api/students/profile
// @access  Private (Student)
const getStudentProfile = async (req, res) => {
    try {
        const student = await Student.findOne({ user: req.user._id }).populate('user', 'name email isVerified');
        if (student) {
            res.json(student);
        } else {
            res.status(404).json({ message: 'Student profile not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update student profile
// @route   PUT /api/students/profile
// @access  Private (Student)
const updateStudentProfile = async (req, res) => {
    try {
        const { cgpa, backlogs, skills, resumeUrl, department, graduationYear } = req.body;
        const student = await Student.findOne({ user: req.user._id });

        if (student) {
            student.cgpa = cgpa !== undefined ? cgpa : student.cgpa;
            student.backlogs = backlogs !== undefined ? backlogs : student.backlogs;
            student.skills = skills || student.skills;
            student.resumeUrl = resumeUrl || student.resumeUrl;
            student.department = department || student.department;
            student.graduationYear = graduationYear || student.graduationYear;

            const updatedStudent = await student.save();
            res.json(updatedStudent);
        } else {
            res.status(404).json({ message: 'Student not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get all students (for Recruiter/TPO)
// @route   GET /api/students
// @access  Private (Recruiter, TPO)
const getStudents = async (req, res) => {
    try {
        const students = await Student.find({}).populate('user', 'name email isVerified');
        res.json(students);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { getStudentProfile, updateStudentProfile, getStudents };
