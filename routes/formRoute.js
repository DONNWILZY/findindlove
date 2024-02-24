const express = require('express');
const router = express.Router();
const Form = require('../models/Form');
const {createForm, fillForm, updateQuestion, updateQuestions} = require('../controllers/formControllers'); // Import the createForm function
const {verifyToken, verifyUser, verifyAdmin, verifyStaff, verifySuperAdmin, checkPermission} = require('../middlewares/authMiddleware');






// Route handler to create a form
router.post('/new', verifyToken, checkPermission('create_form1'), createForm);
// route 
router.post('/fill', fillForm);

// Route to update a question
router.put('/editquestion/:formId/:questionId', async (req, res) => {
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
router.put('/updateQuestions', updateQuestions);


















module.exports = router;