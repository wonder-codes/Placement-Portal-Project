const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    department: {
        type: String,
        enum: ['CS', 'IT', 'MECH', 'ECE', 'CIVIL'], // Add more as needed
        required: true
    },
    cgpa: {
        type: Number,
        required: true
    },
    backlogs: {
        type: Number,
        default: 0
    },
    skills: [{
        type: String
    }],
    resumeUrl: {
        type: String
    },
    placementStatus: {
        type: String,
        enum: ['Unplaced', 'Placed'],
        default: 'Unplaced'
    },
    placedAt: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job'
    }
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);
