const mongoose = require('mongoose');

const NewsSchema = new mongoose.Schema({
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
        like: {
            type: Number,
            default: 0
        },
        love: {
            type: Number,
            default: 0
        },
        clap: {
            type: Number,
            default: 0
        },
        dislike: {
            type: Number,
            default: 0
        }
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
            like: {
                type: Number,
                default: 0
            },
            love: {
                type: Number,
                default: 0
            },
            clap: {
                type: Number,
                default: 0
            },
            dislike: {
                type: Number,
                default: 0
            }
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
                like: {
                    type: Number,
                    default: 0
                },
                love: {
                    type: Number,
                    default: 0
                },
                clap: {
                    type: Number,
                    default: 0
                },
                dislike: {
                    type: Number,
                    default: 0
                }
            },
            createdAt: {
                type: Date,
                default: Date.now
            }
        }],
        createdAt: {
            type: Date,
            default: Date.now
        }
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
        },
        commentReactionsCount: {
            type: Number,
            default: 0
        },
        replyReactionsCount: {
            type: Number,
            default: 0
        }
    },
    meta: {
        views: {
            type: Number,
            default: 0
        },
    }
});

// Add timestamps
NewsSchema.set('timestamps', true);

const News = mongoose.model('News', NewsSchema);

module.exports = News;
