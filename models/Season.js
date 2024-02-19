const mongoose = require('mongoose');

const SeasonSchema = new mongoose.Schema({
    title: {
        type: String
    },
    description: {
        type: String
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
        malehouseMate: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        femaleHouseMate: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
       
    }]






});

const Season = mongoose.model('Season', SeasonSchema);

module.exports = Season;
