const mongoose = require('mongoose');

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
    reactions: {
        likes: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],
        // You can add more reaction types as needed
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
        createdAt: {
            type: Date,
            default: Date.now
        },
        likes: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }]
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Post = mongoose.model('Post', PostSchema);

module.exports = Post;
