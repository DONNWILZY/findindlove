const mongoose = require('mongoose');

const ReactionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    reactionType: {
        type: String,
        required: true,
        enum: ['like', 'love', 'clap', 'dislike']
    },
    activityType: {
        type: String,
        required: true,
        enum: ['post', 'news', 'videoContent', 'postComment', 'newsComment', 'voteComment', 'commentReply' ]
    },
    activityId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
}, { timestamps: true });

const Reaction = mongoose.model('Reaction', ReactionSchema);

module.exports = Reaction;
