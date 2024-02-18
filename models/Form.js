// models/Form.js
const mongoose = require('mongoose');

const formSchema = new mongoose.Schema({
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true
    },

    season: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Season',
        required: true
    },
    
    status: {
        type: String,
        enum: ['pending', 'reviewing', 'exempted', 'disqualified', 'approved'],
        default: 'pending'
    },

    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    formPhoto: {
        type: String
    },

    adminComment: {
        type: String,
    },

    responses: [{
        answers: [{
            questionId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Form.questions'
            },
            response: String
        }]
    }],
    questions: [{
        type: {
            type: String,
            enum: ['text', 'textarea', 'radio', 'checkbox', 'dropdown'],
            required: true
        },
        label: {
            type: String,
            required: true
        },
        options: [String],
        required: {
            type: Boolean,
            default: false
        }
    }]
}, 
{
    timestamps: true 
});

const Form = mongoose.model('Form', formSchema);

module.exports = Form;
