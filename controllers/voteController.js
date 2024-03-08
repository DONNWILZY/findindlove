// voteController.js
const NodeCache = require('node-cache');
const userCache = new NodeCache();
const Vote = require('../models/Vote');
const AdminSettings = require('../models/AdminSetings');
const User = require('../models/User');
const Housemate = require('../models/User'); 



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
      return false;
    }

    // Check if the vote has started, ended, or closed
    const currentTime = new Date();
    if (currentTime < vote.startTime) {
      // console.error('Vote has not started yet.');

      return res.json({
        success: false,
        message: 'Vote has not started yet.'
      });
    }
    if (currentTime > vote.endTime) {
      console.error('Vote has already ended.');
      return false;
    }
    if (vote.closeVote) {
      console.error('Vote is closed.');
      return false;
    }

    // Fetch admin settings
    const adminSettings = await AdminSettings.findById('65e42c2b9f1251620098846a');



    // Check if the vote is free
    if (vote.free) {
      // Count the number of free votes the user has already cast
      const userFreeVotesCount = user.votes.reduce((totalVotes, vote) => {
        if (vote.free) {
          return totalVotes + vote.numberOfVotes;
        }
        return totalVotes;
      }, 0);

      // Calculate the remaining free votes the user can cast
      const remainingFreeVotes = adminSettings.numberOfFreeVotes - userFreeVotesCount;

      // Check if the user has remaining free votes
      if (remainingFreeVotes > 0) {
        // Check if the user is trying to cast more free votes than allowed
        const totalFreeVotesRequested = votes.reduce((totalVotes, voteEntry) => totalVotes + voteEntry.numberOfVotes, 0);
        if (totalFreeVotesRequested <= remainingFreeVotes) {
          // Update the remaining free votes count for the user
          adminSettings.numberOfFreeVotes -= totalFreeVotesRequested;

          // Return the remaining free votes count in the response
          console.log(`${remainingFreeVotes - totalFreeVotesRequested} remaining.`);
        } else {
          console.error('Exceeded the number of available free votes.');
          return false; // Return false to indicate failure
        }
      } else {
        console.error('No free votes available.');
        return false; // Return false to indicate failure
      }
    }
    else {
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

        let source;
        let deductionAmount = 0; // Initialize the deduction amount
        switch (paymentSource) {
          case 'balance':
            if (adminSettings.allowVoteWithBalance) {
              source = 'balance';
              // Calculate the deduction amount based on the amountPerVotePoint
              const deductionAmount = numberOfVotes * adminSettings.amountPerVotePoint;
              // console.log(`${deductionAmount} ${numberOfVotes} ${adminSettings.amountPerVotePoint}`);

              // Check if the user has enough balance
              if (user.wallet.balance < deductionAmount) {
                console.error(`Insufficient Balance. you have ₦${user.wallet.balance}. Kindly Fund your account.`);
                return false; // Return false to indicate failure
              }

              // Deduct the deductionAmount from the user's balance
              user.wallet.balance -= deductionAmount;
            } else {
              console.error('Voting with balance is not allowed.');
              return false; // Return false to indicate failure
            }
            break;

          case 'votePoints':
            if (adminSettings.allowVoteWithVotePoints) {
              source = 'votePoints';
              // Check if the user has enough vote points
              if (user.wallet.votePoints < numberOfVotes) {
                console.error(`Insufficient Vote points. you have ${user.wallet.votePoints} Vote points. Kindy buy more vote Points`);
                return false; // Return false to indicate failure
              }
            } else {
              console.error('Voting with vote points is not allowed.');
              return false; // Return false to indicate failure
            }
            // Deduct the numberOfVotes from the user's votePoints
            user.wallet.votePoints -= numberOfVotes;
            break;
          // Check if voting with referral points is allowed
          case 'referralPoints':
            if (adminSettings.allowVoteWithVotereferralPoints) {
              source = 'referralPoints';
              // Check if the user has enough referral points
              if (user.wallet.referralPoints < numberOfVotes) {
                console.error(`Insufficient referral points. you have ${user.wallet.referralPoints} referral points. Invite more people`);
                return false; // Return false to indicate failure
              }
            } else {
              console.error('Voting with referral points is not allowed.');
              return false; // Return false to indicate failure
            }
            // Deduct the numberOfVotes from the user's referralPoints
            user.wallet.referralPoints -= numberOfVotes;
            break;


          default:
            console.error('Invalid payment source.');
            return false; // Return false to indicate failure
        }

        // // Deduct the number of votes from the appropriate source
        // user.wallet[source] -= numberOfVotes;
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

    console.log(`You have Voted succesfully`);
    return true; // Return true to indicate success
  } catch (error) {
    console.error('Error recording votes:', error);
    return false; // Return false to indicate failure
  }
}


const voteResult = async (housemateId) => {
  try {
    // Find the housemate
    const housemate = await Housemate.findById(housemateId);

    // Check if housemate exists
    if (!housemate) {
      console.error('Housemate not found.');
      return null; // Return null to indicate failure
    }

    // Find all votes
    const votes = await Vote.find();

    // Process the votes to aggregate the total votes for the housemate
    let totalVotes = 0;
    for (const vote of votes) {
      // Check if the housemate exists in the current vote
      const housemateVote = vote.houseMates.find(hm => hm.housemateId.toString() === housemateId);
      if (housemateVote) {
        totalVotes += housemateVote.totalVotes;
      }
    }

    // Construct the result object
    const voteResults = {
      housemate: {
        id: housemate._id,
        name: housemate.name,
        // Add more details about the housemate if needed
      },
      totalVotes: totalVotes
    };

    return voteResults;
  } catch (error) {
    console.error('Error fetching votes and results:', error);
    return null; // Return null to indicate failure
  }
};


const calculateTotalVotesForHousemates = async () => {
  try {
    const totalVotesAggregate = await Vote.aggregate([
      // Unwind the votes array to get each vote separately
      { $unwind: "$votes" },
      // Group by housemate and sum up their total votes
      {
        $group: {
          _id: "$votes.housemate",
          totalVotes: { $sum: "$votes.numberOfVotes" }
        }
      },
      // Project to reshape the output document
      {
        $project: {
          _id: 0, // Exclude the default _id field
          housemate: "$_id",
          totalVotes: 1
        }
      }
    ]);
    
    return totalVotesAggregate;
  } catch (error) {
    console.error('Error calculating total votes for housemates:', error);
    return null;
  }
};


const getVotesForSession = async (voteId) => {
  try {
    const vote = await Vote.findById(voteId)
      .populate({
        path: 'votes',
        populate: {
          path: 'voter housemate',
          select: 'username displayPhoto',
          model: 'User'
        }
      })
      .select('title description votes');

    if (!vote) {
      return null;
    }

    const housemateVotes = {};
    vote.votes.forEach(voteEntry => {
      const housemateId = voteEntry.housemate._id.toString();
      housemateVotes[housemateId] = (housemateVotes[housemateId] || 0) + voteEntry.numberOfVotes;
    });

    return { vote, housemateVotes };
  } catch (error) {
    console.error('Error fetching votes for session:', error);
    return null;
  }
};



const getTotalVotesPerUser = async (voteId) => {
  try {
    const vote = await Vote.findById(voteId).populate({
      path: 'votes',
      populate: {
        path: 'voter',
        select: 'username displayPhoto',
        model: 'User'
      }
    });

    if (!vote) {
      return null;
    }

    const userVotes = {};
    vote.votes.forEach(voteEntry => {
      const userId = voteEntry.voter._id.toString();
      userVotes[userId] = (userVotes[userId] || 0) + voteEntry.numberOfVotes;
    });

    const userVoteDetails = [];
    for (const userId in userVotes) {
      const userDetails = await User.findById(userId).select('username displayPhoto');
      if (userDetails) {
        userVoteDetails.push({ user: userDetails, totalVotes: userVotes[userId] });
      }
    }

    return userVoteDetails;
  } catch (error) {
    console.error('Error fetching total votes per user:', error);
    return null;
  }
};


// Function to calculate total votes for each housemate in a session
const getTotalVotesPerHousemate = async (voteId) => {
  try {
    const vote = await Vote.findById(voteId).populate({
      path: 'houseMates',
      select: 'username displayPhoto firstName lastName gender',
      model: 'User'
    });

    if (!vote) {
      return null;
    }

    const housemateVotes = [];
    vote.houseMates.forEach(housemate => {
      const totalVotes = vote.votes.reduce((total, voteEntry) => {
        if (voteEntry.housemate && voteEntry.housemate.toString() === housemate._id.toString()) {
          return total + voteEntry.numberOfVotes;
        }
        return total;
      }, 0);

      housemateVotes.push({
        userId: housemate._id,
        name: `${housemate.firstName} ${housemate.lastName}`,
        username: housemate.username,
        gender: housemate.gender,
        image: housemate.displayPhoto,
        numberOfVotes: totalVotes
      });
    });

    return housemateVotes;
  } catch (error) {
    console.error('Error fetching total votes per housemate:', error);
    return null;
  }
};

// controllers/voteController.js

const getHousemateResult = async (voteId, housemateId) => {
  try {
    const vote = await Vote.findById(voteId).populate({
      path: 'votes',
      populate: {
        path: 'voter',
        select: 'username displayPhoto',
        model: 'User'
      }
    });

    if (!vote) {
      return null;
    }

    const housemateVotes = vote.votes.filter(vote => vote.housemate.toString() === housemateId);
    if (housemateVotes.length === 0) {
      return null;
    }

    const totalVotes = housemateVotes.reduce((total, vote) => total + vote.numberOfVotes, 0);

    return {
      userId: housemateVotes[0].voter._id,
      username: housemateVotes[0].voter.username,
      image: housemateVotes[0].voter.displayPhoto,
      totalVotes: totalVotes
    };
  } catch (error) {
    console.error('Error fetching housemate result:', error);
    return null;
  }
};









module.exports = {
  createVote,
  addHousemateToVote,
  removeHousemateFromVote,
  updatePoll,
  voteForHousemates,
  voteResult,
  calculateTotalVotesForHousemates,
  getVotesForSession,
  getTotalVotesPerUser,
  getTotalVotesPerHousemate,
  getHousemateResult
};
