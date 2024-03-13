const mongoose = require('mongoose');

const AnonymousMessageSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        // required: true
    },
    message: {
        type: String,
        required: true,
        maxlength: 280 
    },
    image: {
        type: String,
        // required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    parentMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message' 
    },
    turnOnIdentity: {
        type: Boolean,
        default: false
    }
});

AnonymousMessageSchema.pre('save', async function(next) {
    if (!this.sender) {
        this.sender = 'anonymous';
    }
    next();
});

const AnonymousMessage = mongoose.model('AnonymousMessage', AnonymousMessageSchema);

module.exports = AnonymousMessage;
