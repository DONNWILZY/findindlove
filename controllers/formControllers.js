const mongoose = require('mongoose');
const Form = require('../models/Form');
const Season = require('../models/Season');
const NotificationService = require('../services/notificationService');

const createForm = async (req, res) => {
    try {
        const { createdBy, title, description, questionsData, formPhoto, duration, editForm } = req.body;

        const formData = {
            createdBy,
            title,
            description,
            questions: questionsData,
            formPhoto,
            duration,
            editForm
        };

        const createdForm = await Form.create(formData);

        res.status(201).json(createdForm);
    } catch (error) {
        console.error('Error creating form:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};



// const fillForm = async (req, res) => {
//     try {
//         const { userId, formId, responses } = req.body;

//         // Check if formId and userId are provided
//         if (!formId || !userId) {
//             return res.status(400).json({ message: "Both formId and userId are required." });
//         }

//         // Retrieve the form from the database
//         const form = await Form.findById(formId);
//         if (!form) {
//             return res.status(404).json({ message: "Form not found." });
//         }

//         // Check if the form is editable
//         if (!form.editForm.allow) {
//             return res.status(403).json({ message: "This form is not editable." });
//         }

//         // Check if the form has already ended
//         if (form.duration.ends && new Date(form.duration.ends) < Date.now()) {
//             return res.status(403).json({ message: "This form has already ended." });
//         }

//         // Check if responses array is provided
//         if (!Array.isArray(responses)) {
//             return res.status(400).json({ message: "Responses must be provided as an array." });
//         }

//         // Validate and process each response
//         for (const response of responses) {
//             // Check if questionId and response value are provided
//             if (!response.questionId || !response.response || !response.response.value) {
//                 return res.status(400).json({ message: "Each response must include questionId and response value." });
//             }

//             // Find the corresponding question in the form
//             const question = form.questions.find(q => q._id.equals(response.questionId));
//             if (!question) {
//                 return res.status(400).json({ message: `Question with ID '${response.questionId}' not found in the form.` });
//             }

//             // Additional validation based on question type can be added here if needed

//             // Add the response to the form
//             form.responses.push({
//                 user: userId,
//                 answers: [{
//                     questionId: response.questionId,
//                     response: {
//                         value: response.response.value,
//                         type: question.type
//                     }
//                 }]
//             });
//         }

//         // Save the updated form
//         await form.save();

//         res.status(200).json({ message: "Form filled successfully." });
//     } catch (error) {
//         console.error('Error filling form:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// };

/// sedond one
// const fillForm = async (req, res) => {
//     try {
//         const { userId, formId, responses } = req.body;

//         // Check if formId and userId are provided
//         if (!formId || !userId) {
//             return res.status(400).json({ message: "Both formId and userId are required." });
//         }

//         // Retrieve the form from the database
//         const form = await Form.findById(formId);
//         if (!form) {
//             return res.status(404).json({ message: "Form not found." });
//         }

//         // Check if the form is closed
//         if (form.closeForm) {
//             return res.status(403).json({ message: "This form is closed. Contact the Administrator." });
//         }

//         // Check if the form is editable
//         if (!form.editForm.allow) {
//             return res.status(403).json({ message: "This form is not editable." });
//         }
        
//          // Check if the form has started
//         if (form.duration.starts && new Date(form.duration.starts) > Date.now()) {
//             return res.status(403).json({ message: "This form has not started yet. Please try again later." });
//         }

//         // Check if the form has already ended
//         if (form.duration.ends && new Date(form.duration.ends) < Date.now()) {
//             return res.status(403).json({ message: "This form has already ended." });
//         }

//         // Check if responses array is provided and not empty
//         if (!Array.isArray(responses) || responses.length === 0) {
//             return res.status(400).json({ message: "Responses must be provided as a non-empty array." });
//         }

//         // Generate a new response ID
//         const responseId = new mongoose.Types.ObjectId();

//         // Process each response and format the data
//         const formattedResponses = [];
//         for (const response of responses) {
//             if (!response.response || !response.response.value) {
//                 return res.status(400).json({ message: "Response value is missing." });
//             }

//             const question = form.questions.find(q => q._id.equals(response.questionId));
//             if (!question) {
//                 return res.status(400).json({ message: `Question with ID '${response.questionId}' not found in the form.` });
//             }

//             formattedResponses.push({
//                 questionId: response.questionId,
//                 responseId: responseId,
//                 responseValue: response.response.value,
//                 questionLabel: question.label,
//                 questionType: question.type,
//             });
//         }

//         // Add the formatted responses to the form
//         form.responses.push({
//             user: userId,
//             answers: formattedResponses,
//             status: "pending"
//         });

//         // Save the updated form
//         await form.save();

//         // Return the formatted responses along with the form details and a success message
//         res.status(200).json({
//             message: "Form filled successfully.",
//             userId: userId,
//             form: {
//                 _id: form._id,
//                 title: form.title,
//                 description: form.description,
//                 formPhoto: form.formPhoto,
//                 duration: form.duration,
//                 editForm: form.editForm
//             },
//             responses: formattedResponses
//         });
//     } catch (error) {
//         console.error('Error filling form:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// };


const fillForm = async (req, res) => {
    try {
        const { userId, formId, responses } = req.body;

        // Check if formId and userId are provided
        if (!formId || !userId) {
            return res.status(400).json({ message: "Both formId and userId are required." });
        }

        // Retrieve the form from the database
        const form = await Form.findById(formId);
        if (!form) {
            return res.status(404).json({ message: "Form not found." });
        }

        // Check if the form is closed
        if (form.closeForm) {
            return res.status(403).json({ message: "This form is closed. Contact the Administrator." });
        }

        // Check if the form is editable
        if (!form.editForm.allow) {
            return res.status(403).json({ message: "This form is not editable." });
        }
        
        // Check if the form has started
        if (form.duration.starts && new Date(form.duration.starts) > Date.now()) {
            return res.status(403).json({ message: "This form has not started yet. Please try again later." });
        }

        // Check if the form has already ended
        if (form.duration.ends && new Date(form.duration.ends) < Date.now()) {
            return res.status(403).json({ message: "This form has already ended." });
        }

        // Check if responses array is provided and not empty
        if (!Array.isArray(responses) || responses.length === 0) {
            return res.status(400).json({ message: "Responses must be provided as a non-empty array." });
        }

        // Process each response and format the data
        const formattedResponses = [];
        for (const response of responses) {
            if (!response.response || !response.response.value || !response.questionId) {
                return res.status(400).json({ message: "Each response must include questionId and response value." });
            }

            // Check if questionId exists in the form
            const question = form.questions.find(q => q._id.equals(response.questionId));
            if (!question) {
                return res.status(400).json({ message: `Question with ID '${response.questionId}' not found in the form.` });
            }

            // Check if the question is required and answer is provided
            if (question.required && !response.response.value.trim()) {
                return res.status(400).json({ message: `Answer for the required question '${question.label}' is missing.` });
            }

            // Find existing response for the user and the form
            let existingResponse = form.responses.find(resp => 
                resp.user.equals(userId)
            );

            if (existingResponse) {
                // Update existing response
                const existingAnswer = existingResponse.answers.find(answer => 
                    answer.questionId.equals(response.questionId)
                );
                if (existingAnswer) {
                    // Update existing answer
                    existingAnswer.responseValue = response.response.value;
                } else {
                    // Add new answer
                    existingResponse.answers.push({
                        questionId: response.questionId,
                        responseValue: response.response.value,
                        questionLabel: question.label,
                        questionType: question.type
                    });
                }
            } else {
                // Create new response
                existingResponse = {
                    user: userId,
                    answers: [{
                        questionId: response.questionId,
                        responseValue: response.response.value,
                        questionLabel: question.label,
                        questionType: question.type
                    }],
                    status: "pending"
                };
                form.responses.push(existingResponse);
            }

            formattedResponses.push(existingResponse);
        }

        // Save the updated form
        await form.save();

        // Return the formatted responses along with the form details and a success message
        res.status(200).json({
            message: "Form filled successfully.",
            userId: userId,
            form: {
                _id: form._id,
                title: form.title,
                description: form.description,
                formPhoto: form.formPhoto,
                duration: form.duration,
                editForm: form.editForm
            },
            responses: formattedResponses
        });
    } catch (error) {
        console.error('Error filling form:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};








const updateQuestion = async (formId, questionId, newQuestionData) => {
    try {
        // Retrieve the form from the database
        const form = await Form.findById(formId);
        if (!form) {
            return { success: false, message: "Form not found." };
        }

        // Find the question within the form
        const question = form.questions.id(questionId);
        if (!question) {
            return { success: false, message: "Question not found in the form." };
        }

        // Update the question with the new data
        question.set(newQuestionData);

        // Save the updated form
        await form.save();

        // Return a success response with the updated question
        return { success: true, message: "Question updated successfully.", updatedQuestion: question };
    } catch (error) {
        console.error('Error updating question:', error);
        return { success: false, message: 'Internal server error.' };
    }
};



// Function to update multiple questions
const updateQuestions = async (req, res) => {
    try {
        const { formId, questions } = req.body;

        // Check if formId and questions array are provided
        if (!formId || !Array.isArray(questions) || questions.length === 0) {
            return res.status(400).json({ message: "Invalid request. Provide formId and questions array." });
        }

        // Retrieve the form from the database
        const form = await Form.findById(formId);
        if (!form) {
            return res.status(404).json({ message: "Form not found." });
        }

        // Update each question
        for (const updatedQuestion of questions) {
            const existingQuestion = form.questions.find(q => q._id.equals(updatedQuestion.questionId));
            if (!existingQuestion) {
                return res.status(404).json({ message: `Question with ID ${updatedQuestion.questionId} not found in the form.` });
            }

            // Update the existing question with the provided data
            existingQuestion.label = updatedQuestion.label;
            existingQuestion.type = updatedQuestion.type;
            existingQuestion.required = updatedQuestion.required;
        }

        // Save the updated form
        await form.save();

        // Format and return response data
        const responseData = {
            message: "Questions updated successfully.",
            form: {
                _id: form._id,
                title: form.title,
                description: form.description,
                formPhoto: form.formPhoto,
                duration: form.duration,
                editForm: form.editForm
            },
            questions: form.questions
        };

        res.status(200).json(responseData);
    } catch (error) {
        console.error('Error updating questions:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


// Function to update form details
const updateFormDetails = async (req, res) => {
    try {
        // Destructure the formId and updated details from req.body
        const { formId, title, description, formPhoto, duration, editForm, closeForm } = req.body;

        // Check if formId is provided
        if (!formId) {
            return res.status(400).json({ message: "Form ID is required." });
        }

        // Find the form by ID and update its details
        const form = await Form.findByIdAndUpdate(formId, {
            title: title,
            description: description,
            formPhoto: formPhoto,
            duration: duration,
            editForm: editForm,
            closeForm: closeForm
        }, { new: true });

        if (!form) {
            return res.status(404).json({ message: "Form not found." });
        }

        // Return the updated form
        res.status(200).json({ message: "Form details updated successfully.", form: form });
    } catch (error) {
        console.error('Error updating form details:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};



const updateFormResponses = async (req, res) => {
    try {
        const { formId, responses } = req.body;

        // Check if formId and responses array are provided
        if (!formId || !Array.isArray(responses) || responses.length === 0) {
            return res.status(400).json({ message: "Invalid request. Provide formId and responses array." });
        }

        // Retrieve the form from the database
        const form = await Form.findById(formId);
        if (!form) {
            return res.status(404).json({ message: "Form not found." });
        }

        // Check if the form is closed
        if (form.closeForm) {
            return res.status(403).json({ message: "This form is closed. Contact the Administrator." });
        }

        // Check if the form has started
        if (form.duration.starts && new Date(form.duration.starts) > Date.now()) {
            return res.status(403).json({ message: "This form has not started yet. Please try again later." });
        }

        // Check if the form has ended
        if (form.duration.ends && new Date(form.duration.ends) < Date.now()) {
            return res.status(403).json({ message: "This form has already ended." });
        }

         // Check if editing is allowed and if the user has reached the maximum number of edits
         if (form.editForm.allow && form.editForm.numOfTimes <= 0) {
            return res.status(403).json({ message: "You have reached the maximum number of edits for this form." });
        }

        // Update each response
        for (const updatedResponse of responses) {
            const existingResponse = form.responses.find(r => r._id.equals(updatedResponse.responseId));
            if (!existingResponse) {
                return res.status(404).json({ message: `Response with ID ${updatedResponse.responseId} not found in the form.` });
            }

            // Update each answer within the response
            for (const updatedAnswer of updatedResponse.answers) {
                const existingAnswer = existingResponse.answers.find(a => a._id.equals(updatedAnswer.answerId));
                if (!existingAnswer) {
                    return res.status(404).json({ message: `Answer with ID ${updatedAnswer.answerId} not found within the response.` });
                }
                // Update the value of the answer
                existingAnswer.value = updatedAnswer.updatedValue;
            }
        }

        // Decrement the number of edits allowed
        if (form.editForm.allow) {
            form.editForm.numOfTimes -= 1;
        }

        // Save the updated form
        await form.save();

        // Format and return response data
        const responseData = {
            message: "Form responses updated successfully.",
            form: {
                _id: form._id,
                title: form.title,
                description: form.description,
                formPhoto: form.formPhoto,
                duration: form.duration,
                editForm: form.editForm,
                questions: form.questions
            }
        };

        res.status(200).json(responseData);
    } catch (error) {
        console.error('Error updating form responses:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


const deleteForm = async (req, res) => {
    try {
        const formId = req.params.formId;

        // Find the form by its ID and delete it
        const deletedForm = await Form.findByIdAndDelete(formId);

        // Check if the form exists and was successfully deleted
        if (!deletedForm) {
            return res.status(404).json({ message: "Form not found." });
        }

        // Respond with a success message
        res.status(200).json({ message: "Form deleted successfully." });
    } catch (error) {
        console.error('Error deleting form:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};



const addFormToSeason = async (req, res) => {
    try {
        const { seasonId, formId } = req.body;

        // Ensure both seasonId and formId are provided
        if (!seasonId || !formId) {
            return res.status(400).json({ message: "Both seasonId and formId are required in the request body." });
        }

        // Check if the season exists
        const season = await Season.findById(seasonId);
        if (!season) {
            return res.status(404).json({ message: "Season not found." });
        }

        // Check if the form exists
        const form = await Form.findById(formId);
        if (!form) {
            return res.status(404).json({ message: "Form not found." });
        }

        // Check if the form is already added to the season
        if (season.forms.includes(formId)) {
            return res.status(400).json({ message: "Form is already added to the season." });
        }

        // Add the form to the season and the season to the form
        season.forms.push(formId);
        form.season = seasonId;

        // Save changes
        await season.save();
        await form.save();

        return res.status(200).json({ message: "Form added to season successfully." });
    } catch (error) {
        console.error('Error adding form to season:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};



const getFormDetails = async (req, res) => {
    try {
        const { formId } = req.params;

        // Check if formId is provided
        if (!formId) {
            return res.status(400).json({ message: "Form ID is required." });
        }

        // Retrieve the form from the database
        const form = await Form.findById(formId).populate('questions');

        // Check if the form exists
        if (!form) {
            return res.status(404).json({ message: "Form not found." });
        }

        // Extract form details
        const { _id, title, description, formPhoto, duration, editForm, questions } = form;

        // Extract question details
        const formattedQuestions = questions.map(question => {
            const { _id, type, label, options, required } = question;
            return { _id, type, label, options, required };
        });

        // Prepare response
        const responseData = {
            form: {
                _id,
                title,
                description,
                formPhoto,
                duration,
                editForm
            },
            questions: formattedQuestions
        };

        // Return response
        res.status(200).json(responseData);
    } catch (error) {
        console.error('Error getting form details:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};



const getAllFormDetails = async (req, res) => {
    try {
        // Fetch all forms from the database
        const forms = await Form.find();

        // Map over each form to extract form details and questions
        const formsWithDetails = forms.map(form => {
            // Extract form details
            const { _id, title, season, description, duration, editForm, formPhoto, questions } = form;

            // Extract details for each question
            const formattedQuestions = questions.map(question => ({
                type: question.type,
                label: question.label,
                options: question.options
            }));

            // Return form details along with formatted questions
            return {
                _id,
                title,
                season,
                description,
                duration,
                editForm,
                formPhoto,

                
                questions: formattedQuestions
            };
        });

        // Send the response with all form details and questions
        res.status(200).json({ forms: formsWithDetails });
    } catch (error) {
        console.error('Error fetching form details:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


const getFormWithResponses = async (req, res) => {
    try {
        const { formId } = req.params;

        // Find the form with the provided ID
        const form = await Form.findById(formId);
        if (!form) {
            return res.status(404).json({ message: "Form not found." });
        }

        // Populate the response values
        const populatedResponses = await Promise.all(form.responses.map(async response => {
            const populatedAnswers = await Promise.all(response.answers.map(async answer => {
                // Populate the value of the answer
                const populatedAnswer = await answer.populate('value').execPopulate();
                return {
                    answerId: answer._id,
                    responseValue: populatedAnswer.value,
                    questionLabel: answer.questionLabel,
                    questionType: answer.responseType
                };
            }));

            return populatedAnswers;
        }));

        // Construct the response data
        const responseData = populatedResponses.flat();

        res.status(200).json(responseData);
    } catch (error) {
        console.error('Error fetching form details:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


const getFormQuestionsAndResponsesForUser = async (req, res) => {
    try {
        const { formId, userId } = req.params;

        // Find the form with the provided formId
        const form = await Form.findById(formId).exec();

        // Check if the form exists
        if (!form) {
            return res.status(404).json({ message: 'Form not found.' });
        }

        // Extract the question details from the form
        const questions = form.questions.map(question => {
            return {
                questionId: question._id,
                label: question.label,
                type: question.type,
                options: question.options
            };
        });

        // Find all responses for the specified user within the form
        const userResponses = form.responses.filter(response => response.user.toString() === userId);

        // Prepare the response data with questions and user responses
        const responseData = {
            questions: questions,
            userResponses: userResponses
        };

        // Respond with the data
        res.status(200).json(responseData);
    } catch (error) {
        console.error('Error fetching form questions and responses:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
































module.exports = { 
    createForm, 
    fillForm, 
    updateQuestion, 
    updateQuestions, 
    updateFormDetails, 
    updateFormResponses, 
    deleteForm, 
    addFormToSeason, 
    getFormDetails,
    getAllFormDetails,
    getFormWithResponses,
    getFormQuestionsAndResponsesForUser
};
