const mongoose = require('mongoose');
const Reaction = require('./Reaction'); // Assuming you have Reaction schema defined in './Reaction.js'

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

    allowComment:{
        type: Bolean,
    },

    allowReaction:{
        type: Bolean,
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
 
    reactions: {
        type: [Reaction.schema] // Reference to Reaction schema
    },
    comments: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        content: {
            type: String,
            required: true
        },
        reactions: {
            type: [Reaction.schema] // Reference to Reaction schema
        },
        replies: [{
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            content: {
                type: String,
                required: true
            },
            reactions: {
                type: [Reaction.schema] // Reference to Reaction schema
            },
           
        }, 
        { timestamps: true }],
       
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
