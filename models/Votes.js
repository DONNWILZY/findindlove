const mongoose = require('mongoose');

const VoteSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    houseMates: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }],
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        required: true
    },
    maxVotesPerUser: {
        type: Number,
        //default: 1 
    },
    votes: [{
        voters: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        optionIndex: {
            type: Number,
            required: true
        }
    }]
});

const Vote = mongoose.model('Vote', VoteSchema);

module.exports = Vote;
