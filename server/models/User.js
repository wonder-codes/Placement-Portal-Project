const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['Student', 'TPO', 'Recruiter'],
        required: true
    },
    isVerified: {
        type: Boolean,
        default: false // Only relevant for Student/Recruiter if needed, mainly for Student verification by TPO
    },
    profileId: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'role' // Dynamic ref based on role? Or just query the specific collection. Keeping it simple, maybe not needed if we link from the other side. 
        // Let's keep it optional for now.
    }
}, { timestamps: true });

// Password Hash Middleware
userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Match Password
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
