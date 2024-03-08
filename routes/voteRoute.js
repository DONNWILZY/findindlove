// voteRoutes.js

const express = require('express');
const router = express.Router();
const AdminSettings = require('../models/AdminSetings');
const User = require('../models/User');
const Housemate = require('../models/User');
const Vote = require('../models/Vote');
const { createVote, 
    addHousemateToVote, 
    removeHousemateFromVote, 
    updatePoll, 
    voteForHousemates, 
    voteResult, 
    calculateTotalVotesForHousemates, 
    getVotesForSession, 
    getTotalVotesPerUser,
    getTotalVotesPerHousemate,
    getHousemateResult} = require('../controllers/voteController');

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


// POST route to remove a housemate from a vote
router.post('/remove/housemate/:voteId/:housemateId', async (req, res) => {
    try {
        const { voteId, housemateId } = req.params; 

        // Call the controller function to remove the housemate from the vote
        const updatedVote = await removeHousemateFromVote(voteId, housemateId);

        // Sending a success response with the updated vote
        res.status(200).json({ message: 'Housemate removed from vote successfully', vote: updatedVote });
    } catch (error) {
        // Sending an error response if something goes wrong
        res.status(500).json({ error: 'Failed to remove housemate from vote', message: error.message });
    }
});


router.post('/update/:voteId', async (req, res) => {
    try {
        const { voteId } = req.params; // Extracting the voteId from the request parameters
        const updateFields = req.body; // Extracting the update fields from the request body

        // Call the controller function to update the poll
        const updatedPoll = await updatePoll(voteId, updateFields);

        // Sending a success response with the updated poll
        res.status(200).json({ message: 'Poll updated successfully', poll: updatedPoll });
    } catch (error) {
        // Sending an error response if something goes wrong
        res.status(500).json({ error: 'Failed to update poll', message: error.message });
    }
});


// Route to handle user voting
router.post('/vote', async (req, res) => {
    try {
        const { userId,  voteId, votes} = req.body;
        const success = await voteForHousemates(userId, voteId, votes);
        if (success) {
            return res.status(200).json({ success: true, message: 'Votes recorded successfully.' });
        } else {
            return res.status(400).json({ success: false, message: 'Failed to record votes.' });
        }
    } catch (error) {
        console.error('Error voting for housemates:', error);
        return res.status(500).json({ success: false, message: 'Internal server error.' });
    }
});




// Route to get vote results for a specific housemate
router.get('/result/:housemateId', async (req, res) => {
    try {
      const { housemateId } = req.params;
      const voteResults = await voteResult(housemateId);
      
      if (!voteResults) {
        return res.status(404).json({ success: false, message: 'Housemate not found or error fetching votes.' });
      }
  
      res.json({ success: true, data: voteResults });
    } catch (error) {
      console.error('Error fetching votes and results:', error);
      res.status(500).json({ success: false, message: 'Internal server error.' });
    }
  });



  router.get('/totalvotes', async (req, res) => {
    try {
      // Call the function to calculate total votes for housemates
      const totalVotes = await calculateTotalVotesForHousemates();
  
      // Check if total votes were successfully calculated
      if (!totalVotes) {
        return res.status(500).json({ success: false, message: 'Error calculating total votes for housemates.' });
      }
  
      // Return the total votes for housemates
      res.json({ success: true, data: totalVotes });
    } catch (error) {
      console.error('Error calculating total votes for housemates:', error);
      res.status(500).json({ success: false, message: 'Internal server error.' });
    }
  });

  // Route to fetch votes for a particular session
router.get('/votes/:voteId', async (req, res) => {
    try {
      const { voteId } = req.params;
      const voteData = await getVotesForSession(voteId);
  
      if (!voteData) {
        return res.status(404).json({ success: false, message: 'Vote session not found.' });
      }
  
      res.json({ success: true, data: voteData });
    } catch (error) {
      console.error('Error fetching votes for session:', error);
      res.status(500).json({ success: false, message: 'Internal server error.' });
    }
  });


  router.get('/votes/total/:voteId', async (req, res) => {
    try {
      const { voteId } = req.params;
      const userVoteDetails = await getTotalVotesPerUser(voteId);
  
      if (!userVoteDetails) {
        return res.status(404).json({ success: false, message: 'Vote session not found.' });
      }
  
      res.json({ success: true, data: userVoteDetails });
    } catch (error) {
      console.error('Error fetching total votes per user:', error);
      res.status(500).json({ success: false, message: 'Internal server error.' });
    }
  });


  // Route to fetch total votes per housemate in a session
  router.get('/housemate/:voteId', async (req, res) => {
    try {
      const { voteId } = req.params;
      const housemateVotes = await getTotalVotesPerHousemate(voteId);
  
      if (!housemateVotes) {
        return res.status(404).json({ success: false, message: 'Vote session not found.' });
      }
  
      res.json({ success: true, data: housemateVotes });
    } catch (error) {
      console.error('Error fetching total votes per housemate:', error);
      res.status(500).json({ success: false, message: 'Internal server error.' });
    }
  });

  router.get('/result/:voteId/:housemateId', async (req, res) => {
    try {
      const { voteId, housemateId } = req.params;
      const housemateResult = await getHousemateResult(voteId, housemateId);
  
      if (!housemateResult) {
        return res.status(404).json({ success: false, message: 'Housemate not found or error fetching votes.' });
      }
  
      res.json({ success: true, data: housemateResult });
    } catch (error) {
      console.error('Error fetching housemate result:', error);
      res.status(500).json({ success: false, message: 'Internal server error.' });
    }
  });

module.exports = router;
