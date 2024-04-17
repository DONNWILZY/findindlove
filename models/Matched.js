const mongoose = require('mongoose');

const MatchSchema = new mongoose.Schema({
    male: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    female: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    approvalStatus: {
        maleApproval: {
            type: String,
            enum: ['pending', 'accepted', 'rejected', 'unmatched'],
            default: 'pending'
        },
        femaleApproval: {
            type: String,
            enum: ['pending', 'accepted', 'accept',' rejected', 'unmatched'],
            default: 'pending'
        }
    },
    status: {
        type: String,
        enum: ['pending', 'matched', 'rejected', 'unmatched', 'rejectedByMale', 'rejectedByFemale'],
        default: 'pending'
    },
    season: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Season'
    }
},
{ timestamps: true }
);

// Pre-save hook to assign approvalStatus and status based on gender
MatchSchema.pre('save', function(next) {
    if (this.male && this.female) {
        if (this.approvalStatus.maleApproval === 'accepted' && this.approvalStatus.femaleApproval === 'accepted') {
            this.status = 'matched';
        } else if (this.approvalStatus.maleApproval === 'rejected' && this.approvalStatus.femaleApproval === 'rejected') {
            this.status = 'rejected';
        } else if (this.approvalStatus.maleApproval === 'rejected') {
            this.status = 'rejectedByMale';
        } else if (this.approvalStatus.femaleApproval === 'rejected') {
            this.status = 'rejectedByFemale';
        } else if (this.approvalStatus.maleApproval === 'unmatched' || this.approvalStatus.femaleApproval === 'unmatched') {
            this.status = 'unmatched';
        }
    }
    next();
});

const Match = mongoose.model('Match', MatchSchema);

module.exports = Match;
