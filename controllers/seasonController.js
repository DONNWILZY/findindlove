const User = require('../models/User');
const Vote = require('../models/Vote');
const Form = require('../models/Form');
const News = require('../models/News');
const Match = require('../models/Matched');
const VideoContent = require('../models/VideoContent');
const HouseMate = require('../models/User');
const Post = require('../models/Post');
const Season = require('../models/Season');
const Notification = require('../models/Notification');
const NotificationService = require('../services/notificationService');





const createSeason = async (req, res) => {
    const { title, description, subtitle, year, duration, createdBy } = req.body;

    //    // Get the ID of the logged-in user from req.user
    //    const loggedInUserId = req.user._id;

    try {
        // Create the season with the provided data
        const newSeason = new Season({
            title,
            description,
            subtitle,
            year,
            duration,
            createdBy,
        });

        // console.log(createdBy)

        // Populate the createdBy field to extract first name, last name, and role
        const user = await User.findById(createdBy);

        if (!user) {
            throw new Error('User not found');
        }

        // Extract user details
        const { firstName, lastName, role } = user

        // Save the season to the database
        const savedSeason = await newSeason.save();

        // Find all users with the superAdmin role
        const superAdmins = await User.find({ role: 'superAdmin' });

        // Collect IDs of superAdmin users
        const recipientIds = superAdmins.map(admin => admin._id);

        // Create notifications for superAdmin users
        const notifications = recipientIds.map(recipientId => new Notification({
            user: recipientId,
            message: `New season "${title}" has been created by (${role}): ${firstName} ${lastName}.`,
            recipientType: 'superAdmin',
            activityType: 'created New Season',
            activityId: savedSeason._id,

        }));

        // Save notifications to the database
        await Notification.insertMany(notifications);

        return res.status(201).json({
            status: 'success',
            message: 'Season created successfully',
            season: {
                title,
                description,
                subtitle,
                year,
                duration,
                createdBy,
            }
        });
    } catch (error) {
        console.error('Error while creating season:', error);
        return res.status(500).json({
            status: 'failed',
            message: 'An error occurred while creating the season. Please try again.'
        });
    }
};



const addHousematesToSeason = async (req, res) => {
    const { seasonId, housemateIds } = req.body;

    try {
        // Find the season by ID
        const season = await Season.findById(seasonId);

        if (!season) {
            return res.status(404).json({ status: 'failed', message: 'Season not found' });
        }

        // Filter out housemateIds that are already present in the season's houseMate array
        const newHousemateIds = housemateIds.filter(id => !season.houseMate.includes(id));

        if (newHousemateIds.length === 0) {
            return res.status(400).json({ status: 'failed', message: 'All provided users are already housemates in this season' });
        }

        // Find users by their IDs
        const housemates = await User.find({ _id: { $in: housemateIds } });

        // Validate if all housemateIds correspond to valid users
        if (housemates.length !== housemateIds.length) {
            return res.status(400).json({ status: 'failed', message: 'Invalid housemate IDs provided' });
        }

        // Update each housemate's isHouseMate and season fields
        for (const housemate of housemates) {
            housemate.contest.isHouseMate = true;
            housemate.contest.season = seasonId;
            await housemate.save();

            // Create notification for housemate
            await NotificationService.createNotification({
                user: housemate._id,
                message: `You have been added as a housemate to the season "${season.title}"`,
                recipientType: 'user',
                activityType: 'added as housemate',
                activityId: seasonId
            });
        }

        // Create notification for superadmins
        const superAdmins = await User.find({ role: 'superAdmin' });
        for (const admin of superAdmins) {
            // Skip notifying the creator of the season (if they are a superAdmin)
            if (season.createdBy && admin._id.equals(season.createdBy._id)) {
                continue;
            }
            await NotificationService.createNotification({
                user: admin._id,
                message: `New housemates have been added to the season "${season.title}"`,
                recipientType: 'superAdmin',
                activityType: 'housemates added',
                activityId: seasonId
            });
        }



        // Add housemates to the season
        season.houseMate.push(...housemateIds);
        await season.save();

        return res.status(200).json({ status: 'success', message: 'Housemates added to the season', season });
    } catch (error) {
        console.error('Error adding housemates to season:', error);
        return res.status(500).json({ status: 'failed', message: 'Failed to add housemates to the season' });
    }
};


const addHouseMatesToMatch = async (maleId, femaleId, seasonId) => {
    try {
        // Check if both housemates exist and represent the correct genders
        const [male, female] = await Promise.all([
            User.findById(maleId),
            User.findById(femaleId)
        ]);

        if (!male || !female) {
            throw new Error('Invalid housemate IDs provided');
        }

        if (male.gender !== 'male' || female.gender !== 'female') {
            throw new Error('Invalid combination of housemates genders');
        }

        // Check if either of the housemates has already been matched in the season
        const existingMatch = await Match.findOne({
            $or: [
                { male: maleId },
                { female: femaleId }
            ],
            season: seasonId
        });

        if (existingMatch) {
            throw new Error('One of the housemates has already been matched in the season');
        }

        // Create the match
        const match = await Match.create({
            male: maleId,
            female: femaleId,
            approvalStatus: { maleApproval: 'pending', femaleApproval: 'pending' },
            status: 'pending',
            season: seasonId
        });

        // Push the match ID to the season// this is optional, could also be avoided to ditch reduancy
        const season = await Season.findById(seasonId);
        if (!season) {
            throw new Error('Season not found');
        }
        if (season.matches.includes(match._id)) {
            throw new Error('Match ID already exists in the season');
        }
        season.matches.push(match._id);
        await season.save();

        // Notify the male housemate
        await NotificationService.createNotification({
            user: maleId,
            message: `You have been matched with ${female.firstName} ${female.lastName}`,
            recipientType: 'user',
            activityType: 'matched',
            activityId: match._id
        });

        // Notify the female housemate
        await NotificationService.createNotification({
            user: femaleId,
            message: `You have been matched with ${male.firstName} ${male.lastName}`,
            recipientType: 'user',
            activityType: 'matched',
            activityId: match._id
        });

        // Notify the super admin
        const superAdmins = await User.find({ role: 'superAdmin' });
        const recipientIds = superAdmins.map(admin => admin._id);
        await Promise.all(recipientIds.map(async recipientId => {
            await NotificationService.createNotification({
                user: recipientId,
                message: `${male.firstName} ${male.lastName} has been matched with ${female.firstName} ${female.lastName}`,
                recipientType: 'superAdmin',
                activityType: 'matched',
                activityId: match._id,
            });
        }));

        console.log('Housemates added to match:', match);
        return match;
    } catch (error) {
        console.error('Error adding housemates to match:', error);
        throw new Error('Failed to add housemates to match');
    }
};



const acceptMatch = async (userId, matchId, req) => {
    try {
      // Attempt to find the match by ID
      const match = await Match.findById(matchId);
      if (!match) {
        throw new Error('Match not found.');
      }
  
      // Retrieve both housemates from the database
      const [male, female] = await Promise.all([
        User.findById(match.male),
        User.findById(match.female)
      ]);
  
      // Check if both housemates exist and represent the correct genders
      if (!male || !female) {
        throw new Error('One or both housemates do not exist.');
      }
  
      // Check if the user is one of the housemates
      const isMale = male && male._id.equals(userId);
      const isFemale = female && female._id.equals(userId);
  
      if (!isMale && !isFemale) {
        throw new Error(`User with ID ${userId} is not part of this match.`);
      }
  
      // Update approval status based on user role and desired action
      let newApproval = 'accepted'; // Default to accept
  
      // Check for other user actions in the query string or request body
      if (req) {
        const queryParams = req.query;
        const requestBody = req.body;
  
        if ((queryParams && queryParams.action === 'reject') || (requestBody && requestBody.action === 'reject')) {
          newApproval = 'rejected';
        } else if ((queryParams && queryParams.action === 'unmatch') || (requestBody && requestBody.action === 'unmatch')) {
          newApproval = 'unmatched';
        }
      }
  
      if (isMale) {
        match.approvalStatus.maleApproval = newApproval;
      } else if (isFemale) {
        match.approvalStatus.femaleApproval = newApproval;
      }
  
      // Update overall status based on approval changes
      const bothAccepted = match.approvalStatus.maleApproval === 'accepted' && match.approvalStatus.femaleApproval === 'accepted';
      const bothRejected = match.approvalStatus.maleApproval === 'rejected' && match.approvalStatus.femaleApproval === 'rejected';
      const maleRejected = match.approvalStatus.maleApproval === 'rejected' && match.approvalStatus.femaleApproval !== 'rejected';
      const femaleRejected = match.approvalStatus.femaleApproval === 'rejected' && match.approvalStatus.maleApproval !== 'rejected';
  
      if (bothAccepted) {
        match.status = 'matched';
      } else if (bothRejected) {
        match.status = 'rejected';
      } else if (maleRejected) {
        match.status = 'rejectedByMale';
      } else if (femaleRejected) {
        match.status = 'rejectedByFemale';
      } else if (match.approvalStatus.maleApproval === 'unmatched' || match.approvalStatus.femaleApproval === 'unmatched') {
        match.status = 'unmatched';
      }
  
      // Persist the changes to the database
      await match.save();
  
      return match;
    } catch (error) {
      console.error('Error during match acceptance:', error);
      throw error; // Rethrow the error to handle it in the calling function
    }
  };
  


const changeMatchStatus = async (maleUserId, femaleUserId) => {
    try {
        const [maleUser, femaleUser] = await Promise.all([
            User.findById(maleUserId).select('firstName lastName username').exec(),
            User.findById(femaleUserId).select('firstName lastName username').exec()
        ]);

        if (!maleUser || !femaleUser) {
            return { success: false, message: 'Male or female user does not exist.' };
        }

        const match = await Match.findOne({ male: maleUserId, female: femaleUserId }).exec();
        if (!match) {
            return { success: false, message: 'Match does not exist.' };
        }

        match.male = maleUser;
        match.female = femaleUser;

        if (match.approvalStatus.maleApproval === 'accepted' && match.approvalStatus.femaleApproval === 'accepted') {
            match.status = 'matched';
        } else if (match.approvalStatus.maleApproval === 'rejected' || match.approvalStatus.femaleApproval === 'rejected') {
            match.status = 'rejected';
        } else if (match.approvalStatus.femaleApproval === 'rejected') {
            match.status = 'rejected';
        } else if (match.approvalStatus.maleApproval === 'unmatched' || match.approvalStatus.femaleApproval === 'unmatched') {
            match.status = 'unmatched';
        }

        await match.save();
        
        return { success: true, message: 'Match status updated successfully.', match };
    } catch (error) {
        return { success: false, message: 'Error changing match status: ' + error.message };
    }
};
















const season = {
    createSeason,
    addHousematesToSeason,
    addHouseMatesToMatch,
    acceptMatch,
    changeMatchStatus

}

module.exports = season
