// voteRoutes.js

const express = require('express');
const router = express.Router();
const { createVote, addHousemateToVote } = require('../controllers/voteController');

// Route to create a new vote
router.post('/create', async (req, res) => {
    try {
        const { title, description, season, houseMates, startTime, endTime, allowComment, allowReaction } = req.body;
        const newVote = await createVote(title, description, season, houseMates, startTime, endTime, allowComment, allowReaction);
        res.status(201).json({ message: 'Vote created successfully', vote: newVote });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create vote', message: error.message });
    }
});


// Route to add a new housemate to a vote
router.post('/add/housemate/:voteId', async (req, res) => {
    try {
        const { voteId } = req.params;
        const { housemateId } = req.body;

        // Call the function to add the housemate to the vote
        const updatedVote = await addHousemateToVote(voteId, housemateId);

        res.status(200).json({ message: 'Housemate added to vote successfully', vote: updatedVote });
    } catch (error) {
        res.status(500).json({ error: 'Failed to add housemate to vote', message: error.message });
    }
});




module.exports = router;
