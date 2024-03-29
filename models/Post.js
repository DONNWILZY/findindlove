const mongoose = require('mongoose');
const Reaction = require('./Reactions'); 
const Comment = require('./Comment'); 


const PostSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: true
    },
    
    images: {
        type: [String]
    },

    reactions: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Reaction' 
    }],

    comments: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Comment' 
    }],

    allowComment:{
        type: Boolean,
    },

    allowReaction:{
        type: Boolean,
    },
    
}, { timestamps: true });

const Post = mongoose.model('Post', PostSchema);

module.exports = Post;
