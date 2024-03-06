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
        ref: 'User', 
        // required: true
    }],
    startTime: {
        type: Date,
        required: true,
        default: Date.now() 
    },
    endTime: {
        type: Date,
      
    },
    allowComment: {
        type: Boolean,
        default: true 
    },
    closeVote: {
        type: Boolean,
        default: false 
    },
    free: {
        type: Boolean,
        default: false 
    },
    votes: [{
        voter: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        housemate: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            // required: true
        },

        // number of votes particular User is giving
        numberOfVotes: {
            type: Number,
            // required: true,
            min: 1  
        }
    }]
});

const Vote = mongoose.model('Vote', VoteSchema);

module.exports = Vote;
