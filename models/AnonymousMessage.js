const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true
    },
    content: {
        type: String,
        required: true,
        maxlength: 280 
    },
    image: {
        type: String,
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

module.exports = mongoose.model('Message', messageSchema);
