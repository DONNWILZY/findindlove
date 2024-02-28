const mongoose = require('mongoose');
const Reaction = require('./Reactions'); 
const Comment = require('./Comment'); 

const NewsSchema = new mongoose.Schema({
    user: [{
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
        // required: true
    },
    keywords: {
        type: [String],
        required: true
    },
    tags: {
        type: [String]
    },
    fullText: {
        type: String // For full-text search indexing
    },
    season: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Season',
        // required: true
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
        type: [Reaction.schema],
        default: []
    },
    comments: {
        type: [Comment.schema],
        default: []
    },
    allowComment: {
        type: Boolean,
        default: true
    },
    allowReaction: {
        type: Boolean,
        default: true
    },
    Promo: {
        type: Boolean
    },
    featured: {
        type: Boolean
    },
    latest: {
        type: Boolean
    },
    exclusive: {
        type: Boolean
    },
    notifyAdmin: {
        type: String
    },
    notifyUser: {
        type: String
    },
    status: {
        type: String,
        enum: ['Approved', 'Declined', 'Reviewing', 'Pending'],
        default: 'Pending'
    },

    autoSchedule: {
        type: Boolean,
        default: false // Default to false, indicating no auto-scheduling initially
    },
    scheduledDate: {
        type: Date, // Date and time for scheduling publication
        required: function() {
            return this.autoSchedule === true; 
        }
    },
    scheduleStatus: {
        type: String,
        enum: ['Scheduled', 'Posted'],
        default: 'Scheduled' // Default to "Scheduled" indicating articles are initially scheduled
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
        },
        views: {
            type: Number,
            default: 0
        },
        shares: {
            type: Number,
            default: 0
        },
        bookmarks: {
            type: Number,
            default: 0
        }
    },
    version: {
        type: Number,
        default: 1
    },
    revisionHistory: [{
        version: Number,
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    lastRevision: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'News'
    }
}, { timestamps: true });


const News = mongoose.model('News', NewsSchema);
module.exports = News;
