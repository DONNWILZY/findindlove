const mongoose = require('mongoose');
const Reaction = require('./Reactions');  // Assuming you have Reaction schema defined in './Reaction.js'
const Comment = require('./Comment');

const VideoContentSchema = new mongoose.Schema({
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    season: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Season',
        required: true
    },
    allowComment: {
        type: Boolean, 
        default: true // Default allowComment to true
    },
    allowReaction: {
        type: Boolean, 
        default: true // Default allowReaction to true
    },
    videoLink: {
        type: String,
        required: true
    },
    keywords: {
        type: [String],
        required: true
    },
    tags: {
        type: [String]
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    reactions: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Reaction' 
    }],

    comments: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Comment' 
    }], 

    analytics: {
        reactionsCount: {
            type: Number,
            default: 0
        },
        commentsCount: {
            type: Number,
            default: 0
        },
        repliesCount: {
            type: Number,
            default: 0
        }
    }
}, { timestamps: true });

const VideoContent = mongoose.model('VideoContent', VideoContentSchema);

module.exports = VideoContent;
