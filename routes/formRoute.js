const express = require('express');
const router = express.Router();
const Form = require('../models/Form');
const {createForm, fillForm, updateQuestion, updateQuestions, updateFormDetails} = require('../controllers/formControllers'); // Import the createForm function
const {verifyToken, verifyUser, verifyAdmin, verifyStaff, verifySuperAdmin, checkPermission} = require('../middlewares/authMiddleware');






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


















module.exports = router;