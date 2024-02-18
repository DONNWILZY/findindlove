const mongoose = require('mongoose');
const Reaction = require('./Reaction'); 
const Comment = require('./Comment'); 

const NewsSchema = new mongoose.Schema({
    houseMate: [{
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
    images: {
        type: [String],
        required: true
    },
    featuredImage: {
        type: String,
        required: true
    },
    keywords: {
        type: [String],
        required: true
    },
    season: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Season',
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
    author: {
        type: String,
        required: true
    },
    reactions: {
        type: [Reaction.schema], // Reference to Reaction schema
        default: []
    },
    comments: {
        type: [Comment.schema], // Reference to comment schema
        default: []
    },
    allowComment: {
        type: Boolean,
        default: true // Default allowComment to true
    },
    allowReaction: {
        type: Boolean,
        default: true // Default allowReaction to true
    },
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

const News = mongoose.model('News', NewsSchema);

module.exports = News;
