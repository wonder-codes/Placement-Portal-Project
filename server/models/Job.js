const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    recruiter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    companyName: {
        type: String,
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
    eligibility: {
        minCGPA: {
            type: Number,
            default: 0
        },
        maxBacklogs: {
            type: Number,
            default: 99
        }
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
