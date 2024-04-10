const User = require('../models/User');
const Vote = require('../models/Vote');
const Form = require('../models/Form');
const News = require('../models/News');
const VideoContent = require('../models/VideoContent');
const HouseMate = require('../models/User');
const Post = require('../models/Post');
const Season = require('../models/Season');
const Notification = require('../models/Notification');
const NotificationService = require('../services/notificationService');





const createSeason = async (req, res) => {
    const { title, description, subtitle, year, duration, createdBy} = req.body;

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
            createdBy ,
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



const season = {
    createSeason,
    addHousematesToSeason

}

module.exports = season
