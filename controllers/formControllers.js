const mongoose = require('mongoose');
const Form = require('../models/Form');

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

        // Check if the form is editable
        if (!form.editForm.allow) {
            return res.status(403).json({ message: "This form is not editable." });
        }

        // Check if the form has already ended
        if (form.duration.ends && new Date(form.duration.ends) < Date.now()) {
            return res.status(403).json({ message: "This form has already ended." });
        }

        // Check if responses array is provided
        if (!Array.isArray(responses)) {
            return res.status(400).json({ message: "Responses must be provided as an array." });
        }

        // Process each response and format the data
        const formattedResponses = responses.map(response => {
            const question = form.questions.find(q => q._id.equals(response.questionId));
            if (!question) {
                return res.status(400).json({ message: `Question with ID '${response.questionId}' not found in the form.` });
            }
            return {
                questionId: response.questionId,
                responseId: new mongoose.Types.ObjectId(), // Generate a new response ID
                responseValue: response.response.value,
                questionLabel: question.label,
                questionType: question.type
            };
        });

        // Add the formatted responses to the form
        form.responses.push({
            user: userId,
            answers: formattedResponses,
            status: "pending"
        });

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















module.exports = { createForm, fillForm, updateQuestion, updateQuestions };
