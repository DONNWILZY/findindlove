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
    season: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Season',
        required: true
    },
    houseMates: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Housemate',
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
    votes: [{
        voter: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        housemate: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Housemate',
            required: true
        },
        numVotes: {
            type: Number,
            required: true,
            min: 1  // Ensure at least one vote is cast
        },
        optionIndex: {
            type: Number,
            required: true
        }
    }]
});

const Vote = mongoose.model('Vote', VoteSchema);

module.exports = Vote;
