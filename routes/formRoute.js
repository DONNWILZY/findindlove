const express = require('express');
const router = express.Router();
const Form = require('../models/Form');
const {
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
} = require('../controllers/formControllers'); // Import the createForm function

const {
    verifyToken, 
    verifyUser, 
    verifyAdmin, 
    verifyStaff, 
    verifySuperAdmin, 
    checkPermission
} = require('../middlewares/authMiddleware');






// Route handler to create a form
router.post('/new', verifyToken, checkPermission('create_form1'), createForm);

// route to fill a form
router.post('/fill', verifyToken, fillForm);

// Route to update a single question
router.put('/editquestion/:formId/:questionId', verifyToken, checkPermission('update_form'), async (req, res) => {
    try {
        const { formId, questionId } = req.params;
        const newQuestionData = req.body; 

        // Call the updateQuestion function
        const result = await updateQuestion(formId, questionId, newQuestionData);

        // Check if the operation was successful
        if (result.success) {
            res.status(200).json(result);
        } else {
            res.status(400).json(result);
        }
    } catch (error) {
        console.error('Error updating question:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

// Route to update multiple questions
router.put('/updateQuestions', verifyToken, checkPermission('update_form'), updateQuestions);

// update form details 
router.put('/updateform', verifyToken, checkPermission('update_form'), updateFormDetails);

// update response 
router.put('/updateResponse', verifyToken, updateFormResponses);

// DELETE route to delete a form by its ID
router.delete('/delete/:formId',  verifyToken, checkPermission('update_form'), deleteForm);

// add form to seasn and season to form
router.post('/addseason', verifyToken, checkPermission('update_form'), addFormToSeason);

// get form with ID only form details and questiosn
router.get('/view/:formId',  getFormDetails);

// get all form with with questions 
router.get('/forms', getAllFormDetails);

// get a single form and responses 
router.get('/responses/:formId', getFormWithResponses);

router.get('/response/:formId', getFormQuestionsAndResponsesForUser);





















module.exports = router;