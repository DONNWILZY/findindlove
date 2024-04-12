const mongoose = require('mongoose');

const MatchSchema = new mongoose.Schema({
    maleHouseMate: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    femaleHouseMate: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    approvalStatus: {
        maleApproval: {
            type: String,
            enum: ['pending', 'accept', 'rejected'],
            default: 'pending'
        },
        femaleApproval: {
            type: String,
            enum: ['pending', 'accept', 'rejected'],
            default: 'pending'
        }
    },
    status: {
        type: String,
        enum: ['pending', 'matched', 'rejected'],
        default: 'pending'
    },
    season: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Season'
    }
},
{ timestamps: true }
);

const Match = mongoose.model('Match', MatchSchema);

module.exports = Match;
