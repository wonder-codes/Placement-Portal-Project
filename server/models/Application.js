const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true
    },
    status: {
        type: String,
        enum: ['Applied', 'Test Scheduled', 'Interview Scheduled', 'Selected', 'Rejected', 'Offer Accepted', 'Offer Rejected'],
        default: 'Applied'
    },
    roundsProgress: [{
        roundName: String,
        status: {
            type: String,
            enum: ['Pending', 'Cleared', 'Failed'],
            default: 'Pending'
        },
        feedback: String,
        score: Number
    }],
    testSchedule: {
        dateTime: Date,
        location: String, // Online link or physical venue
        instructions: String
    },
    interviewSchedule: {
        dateTime: Date,
        location: String,
        instructions: String
    },
    offerDetails: {
        salary: Number,
        offerLetterUrl: String,
        expiryDate: Date
    },
    appliedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

module.exports = mongoose.model('Application', applicationSchema);
