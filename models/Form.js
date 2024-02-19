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
        }],
        // label:{
        //     type: String
        // }
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

// Pre-save hook to link answers to questions
formSchema.pre('save', function(next) {
    const form = this;
    form.responses.forEach(responseGroup => {
        responseGroup.answers.forEach(answer => {
            const question = form.questions.find(question => question._id.equals(answer.questionId));
            if (question) {
                answer.questionLabel = question.label;
            }
        });
    });
    next();
});

const Form = mongoose.model('Form', formSchema);

module.exports = Form;
