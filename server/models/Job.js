const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    recruiter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true
    },
    role: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    package: {
        type: Number, // In LPA
        required: true
    },
    jobType: {
        type: String,
        enum: ['Full-time', 'Internship'],
        required: true,
        default: 'Full-time'
    },
    location: {
        type: String
    },
    bond: {
        type: String
    },
    eligibility: {
        minCGPA: {
            type: Number,
            default: 0
        },
        maxBacklogs: {
            type: Number,
            default: 99
        },
        allowedBranches: [{
            type: String,
            enum: ['CS', 'IT', 'MECH', 'ECE', 'CIVIL']
        }],
        passingYear: {
            type: Number
        }
    },
    rounds: [{
        name: { type: String }, // e.g. 'Test', 'Technical', 'HR'
        description: String
    }],
    status: {
        type: String,
        enum: ['DRAFT', 'PENDING_APPROVAL', 'PUBLISHED', 'CLOSED'],
        default: 'DRAFT'
    },
    isActive: { // TPO can still deactivate manually
        type: Boolean,
        default: true
    },
    deadline: {
        type: Date
    },
    postedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

module.exports = mongoose.model('Job', jobSchema);
