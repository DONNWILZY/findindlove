// voteController.js

const Vote = require('../models/Vote');

// Function to create a new vote
const createVote = async (title, description, season, houseMates, startTime, endTime, allowComment = true, allowReaction = true) => {
    try {
        const newVote = new Vote({
            title,
            description,
            season,
            houseMates,
            startTime,
            endTime,
            allowComment,
            allowReaction,
            votes: []
        });

        const savedVote = await newVote.save();
        return savedVote;
    } catch (error) {
        throw error;
    }
};



const addHousemateToVote = async (voteId, housemateId) => {
  try {
      // Find the vote document by its ID
      const vote = await Vote.findById(voteId);

      if (!vote) {
          throw new Error('Vote not found');
      }

      // Check if the housemate is already in the houseMates array
      if (vote.houseMates.includes(housemateId)) {
          throw new Error('Housemate already exists in the vote');
      }

      // Add the new housemate to the houseMates array
      vote.houseMates.push(housemateId);

      // Save the updated vote document
      const updatedVote = await vote.save();
      
      return updatedVote;
  } catch (error) {
      throw error;
  }
};


module.exports = {
    createVote, 
    addHousemateToVote
};
