const mongoose = require('mongoose');

const SeasonSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    subtitle: String,
    year: {
        type: Date,
        required: true
    },
    duration: {
        starts: {
            type: Date,
            required: true
        },
        ends: {
            type: Date,
            required: true
        }
    },
    news: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'News'
    }],
    videoContents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'VideoContent'
    }],
    forms: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Form'
    }],
    vote: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vote'
    }],
    houseMate: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],

    matches: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Match'
    }],
    
   
    createdAt: {
        type: Date,
        default: Date.now
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

// Indexes
SeasonSchema.index({ title: 'text' }); // Example index on the title field

const Season = mongoose.model('Season', SeasonSchema);

module.exports = Season;
