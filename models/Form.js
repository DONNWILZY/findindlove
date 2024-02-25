const mongoose = require('mongoose');

const formSchema = new mongoose.Schema({
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    userStatus: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',

        },
        status: {
            type: String,
            enum: ['pending', 'reviewing', 'exempted', 'disqualified', 'approved'],
            default: 'pending'
        },

       
    }],

    closeForm:{
        type: Boolean,
    },

    season: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Season',
        // required: true
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
    duration: {
        starts: {
            type: Date,
            default: Date.now
        },
        ends: {
            type: Date
        }
    },
    editForm: {
        allow: {
            type: Boolean
        },
        numOfTimes: {
            type: Number,
            default: 2
        }
    },
    responses: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        answers: [{
            questionId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Form.questions'
            },
            response: {
                value: {
                    type: String 
                },
                type: {
                    type: String,
                    enum: ['text', 'textarea', 'radio', 'checkbox', 'dropdown', 'date', 'file']
                }
            },        
            
        }],
        status: {
            type: String,
            enum: ['pending', 'completed'],
            default: 'pending'
        },
        sendMeACopy:{
            type: Boolean,
        },
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
        options: [{
            tyep: String
        }],
        required: {
            type: Boolean,
            default: false
        }
    }]
},
    {
        timestamps: true
    });

// Pre-save hook to link answers to questions and limit response edits
formSchema.pre('save', async function(next) {
    // Get the form instance
    const form = this;

    // Check if there are modifications to responses
    if (form.isModified('responses')) {
        // Check if the responses are being updated for the first time
        if (!form.responses || form.responses.length === 0) {
            // This is the initial filling, so set the initial edit count
            form.initialEditCount = form.editForm.numOfTimes;
        } else {
            // Check if the edit count has reached zero
            if (form.editForm.numOfTimes === 0) {
                throw new Error('You have reached the maximum number of edits for this form.');
            } else {
                // Decrement the edit count
                form.editForm.numOfTimes -= 1;

                // Notify user about the remaining edit count
                const remainingEdits = form.editForm.numOfTimes;
                // You can implement your notification mechanism here
                console.log(`You have ${remainingEdits} edit(s) remaining for this form.`);
            }
        }
    }

    // Continue with the save operation
    next();
});



// Pre-save hook to link answers to questions
formSchema.pre('save', function(next) {
    const form = this;
    form.responses.forEach(responseGroup => {
        responseGroup.answers.forEach(answer => {
            const question = form.questions.find(question => question._id.equals(answer.questionId));
            if (question) {
                // If the question is found, update the answer with question details
                answer.questionLabel = question.label;
                answer.responseType = question.type;
            } else {
                // If the question is not found, remove the answer
                responseGroup.answers = responseGroup.answers.filter(a => !a.questionId.equals(answer.questionId));
            }
        });
    });
    next();
});




const Form = mongoose.model('Form', formSchema);

module.exports = Form;
