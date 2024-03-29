const mongoose = require('mongoose');
const Reaction = require('./Reactions'); 

const CommentReplySchema = new mongoose.Schema({
    
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    content: {
        type: String,
    
    },

    // Reference to Reaction schema
    reactions: {
        type: [Reaction.schema] 
    },

    activityType: {
        type: String,
        required: true,
        enum: ['postComment', 'newsComment', 'videoContentComment', 'voteComment' ]
    },

    activityId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }

}, { timestamps: true });

const CommentReply = mongoose.model('CommentReply', CommentReplySchema);

module.exports = CommentReply;
