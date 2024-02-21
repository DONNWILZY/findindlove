const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
       // required: true
    },
    reporter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
       // required: true
    },
    reason: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'resolved'],
        default: 'pending'
    },
    accountStatus: {
        action: {
            type: String,
            enum: ['blocked', 'suspended', 'reviewing'],
        },
        duration: {
            type: Number,
        },
        durationType: {
            type: String,
            enum: ['hours', 'days', 'months', 'year']
        },
    },
    note: {
        type: String,
    }
}, { timestamps: true });

reportSchema.pre('save', function(next) {
    if (this.isModified('accountStatus.action')) {
        const durationInMilliseconds = calculateDurationInMilliseconds(this.duration, this.durationType);
        this.accountStatus.expiresAt = new Date(Date.now() + durationInMilliseconds);
    }
    next();
});

const Report = mongoose.model('Report', reportSchema);

function calculateDurationInMilliseconds(duration, durationType) {
    switch (durationType) {
        case 'hours':
            return duration * 3600 * 1000; // Convert hours to milliseconds
        case 'days':
            return duration * 24 * 3600 * 1000; // Convert days to milliseconds
        case 'months':
            return duration * 30 * 24 * 3600 * 1000; // Assuming 30 days per month
        case 'year':
            return duration * 365 * 24 * 3600 * 1000; // Assuming 365 days per year
        default:
            return 0;
    }
}

module.exports = Report;
