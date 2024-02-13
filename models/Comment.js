const mongoose = require('mongoose');
const Reaction = require('./Reaction'); // Reaction schema
const CommentReply = require( './CommentReply' ) // Comment schema

const CommentSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    content: {
        type: String,
    
    },

    reactions: {
        type: [Reaction.schema] // Reference to Reaction schema
    },

    replies: {
        type: [CommentReply.schema] // Reference to comment replies  schema
    },

    activityType: {
        type: String,
        required: true,
        enum: ['post', 'news', 'videoContent', 'vote' ]
    },

    activityId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }

}, { timestamps: true });

const Comment = mongoose.model('Comment', CommentSchema);

module.exports = Comment;
