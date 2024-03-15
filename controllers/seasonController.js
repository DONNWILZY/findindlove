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
    const { title, description, subtitle, year, duration, createdBy } = req.body;

    try {
        // Create the season with the provided data
        const newSeason = new Season({
            title,
            description,
            subtitle,
            year,
            duration,
            createdBy // Attach the creator to the season
        });

        // Save the season to the database
        const savedSeason = await newSeason.save();

        // Find all users with the superAdmin role
        const superAdmins = await User.find({ role: 'superAdmin' });

        // Collect IDs of superAdmin users
        const recipientIds = superAdmins.map(admin => admin._id);

        // Create notifications for superAdmin users
        const notifications = recipientIds.map(recipientId => new Notification({
            user: recipientId,
            message: `New season "${title}" has been created.`,
            recipientType: 'superAdmin'
            // You may add additional fields or customizations here
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
                duration
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




















const season = {
    createSeason,

}

module.exports = season
