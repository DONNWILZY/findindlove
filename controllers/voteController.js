// voteController.js
const NodeCache = require('node-cache');
const userCache = new NodeCache();
const Vote = require('../models/Vote');
const AdminSettings = require('../models/AdminSetings');
const User = require('../models/User');


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


const removeHousemateFromVote = async (voteId, housemateId) => {
  try {
      // Find the vote document by its ID
      const vote = await Vote.findById(voteId);

      if (!vote) {
          throw new Error('Vote not found');
      }

      // Check if the housemate exists in the houseMates array
      const housemateIndex = vote.houseMates.indexOf(housemateId);
      if (housemateIndex === -1) {
          throw new Error('Housemate not found in the vote');
      }

      // Remove the housemate from the houseMates array
      vote.houseMates.splice(housemateIndex, 1);

      // Save the updated vote document
      const updatedVote = await vote.save();
      
      return updatedVote;
  } catch (error) {
      throw error;
  }
};


const updatePoll = async (voteId, updateFields) => {
  try {
      // Find the poll document by its ID
      const vote = await Vote.findById(voteId);

      if (!vote) {
          throw new Error('Vote not found');
      }

      // Update the fields of the poll document
      Object.assign(vote, updateFields);

      // Save the updated poll document
      const updatedPoll = await vote.save();

      return updatedPoll;
  } catch (error) {
      throw error;
  }
};






// Function to perform the vote
const getUserBalance = async (userId) => {
  // Check if the balance is cached
  const cachedBalance = userCache.get(userId);
  if (cachedBalance !== undefined) {
      // Return the cached balance if available
      return cachedBalance;
  } else {
      // If balance is not cached, calculate it using virtual schema
      const user = await User.findById(userId);
      if (!user) {
          throw new Error('User not found.');
      }
      const balance = user.wallet.balance;
      // Cache the balance for future use with a time-to-live (TTL) of 1 hour (for example)
      userCache.set(userId, balance, 3600); // TTL in seconds (1 hour)
      return balance;
  }
}

// Function to handle voting for multiple housemates
const voteForHousemates = async (userId, voteId, votes) => {
  try {
      // Fetch the user
      const user = await User.findById(userId);

      // Check if user exists
      if (!user) {
          console.error('User not found.');
          return false; // Return false to indicate failure
      }

      // Fetch the vote
      const vote = await Vote.findById(voteId);

      // Check if vote exists
      if (!vote) {
          console.error('Vote not found.');
          return false; // Return false to indicate failure
      }

      // Check if the vote has started, ended, or closed
      const currentTime = new Date();
      if (currentTime < vote.startTime) {
          console.error('Vote has not started yet.');
          return false; // Return false to indicate failure
      }
      if (currentTime > vote.endTime) {
          console.error('Vote has already ended.');
          return false; // Return false to indicate failure
      }
      if (vote.closeVote) {
          console.error('Vote is closed.');
          return false; // Return false to indicate failure
      }

      // Fetch admin settings
      const adminSettings = await AdminSettings.findById('65e42c2b9f1251620098846a');

       // Check if the vote is free
       if (vote.free) {
        // Automatically deduct the votes from the number of free votes allowed in AdminSettings
        if (adminSettings.allowFreeMultipleVote && adminSettings.numberOfFreeVotes > 0) {
            adminSettings.numberOfFreeVotes -= votes.reduce((totalVotes, voteEntry) => totalVotes + voteEntry.numberOfVotes, 0);
        } else {
              console.error('No free votes available.');
              return false; // Return false to indicate failure
          }
        } else {
          // Iterate over the votes array
          for (const voteEntry of votes) {
              const { housemateId, numberOfVotes, paymentSource } = voteEntry;
      
              // Check if the housemate exists in the vote
              const housemateExists = vote.houseMates.some(housemate => housemate.equals(housemateId));
              if (!housemateExists) {
                  console.error('Housemate not found in the vote.');
                  return false; // Return false to indicate failure
              }
      
              // Check if the user has selected a source for voting
              if (!paymentSource) {
                  console.error('Payment source not selected for vote.');
                  return false; // Return false to indicate failure
              }
      
              // Deduct the number of votes from the appropriate source
              let source;
              switch (paymentSource) {
                  case 'balance':
                      if (adminSettings.allowVoteWithBalance) {
                          source = 'balance';
                      } else {
                          console.error('Voting with balance is not allowed.');
                          return false; // Return false to indicate failure
                      }
                      break;
                  case 'votePoints':
                      if (adminSettings.allowVoteWithVotePoints) {
                          source = 'votePoints';
                      } else {
                          console.error('Voting with vote points is not allowed.');
                          return false; // Return false to indicate failure
                      }
                      break;
                  case 'referralPoints':
                      if (adminSettings.allowVoteWithReferralPoints) {
                          source = 'referralPoints';
                      } else {
                          console.error('Voting with referral points is not allowed.');
                          return false; // Return false to indicate failure
                      }
                      break;
                  default:
                      console.error('Invalid payment source.');
                      return false; // Return false to indicate failure
              }
      
              // Deduct the number of votes from the appropriate source
              user.wallet[source] -= numberOfVotes;
          }
      }
      

      // Save updated user
      await user.save();

      // Record the votes for each housemate
      for (const voteEntry of votes) {
          const { housemateId, numberOfVotes } = voteEntry;
          const housemateIndex = vote.houseMates.findIndex(housemate => housemate.equals(housemateId));
          vote.votes.push({
              voter: userId,
              housemate: housemateId,
              numberOfVotes: numberOfVotes
          });
          vote.houseMates[housemateIndex].totalVotes += numberOfVotes;
      }

      // Save updated vote
      await vote.save();

      console.log('Votes recorded successfully.');
      return true; // Return true to indicate success
  } catch (error) {
      console.error('Error recording votes:', error);
      return false; // Return false to indicate failure
  }
}






module.exports = {
    createVote, 
    addHousemateToVote,
    removeHousemateFromVote,
    updatePoll,
    voteForHousemates
};
