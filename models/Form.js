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

        feedback: {
            type: String
        },


    }],
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
                    type: String // Or change it to match the appropriate type of response
                },
                type: {
                    type: String,
                    enum: ['text', 'textarea', 'radio', 'checkbox', 'dropdown']
                }
            }
        }],
        status: {
            type: String,
            enum: ['pending', 'completed'],
            default: 'pending'
        }
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

// check for edit
formSchema.pre('findOneAndUpdate', async function (next) {
    // Check if the update operation includes modifications to form responses
    if (this._update.responses) {
        const formId = this._conditions._id;
        const form = await this.model.findOne({ _id: formId });

        // Increment the edit count
        form.editForm.numOfTimes -= 1;

        // Update the document with the new edit count
        await this.model.updateOne({ _id: formId }, { editForm: form.editForm });
    }
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
