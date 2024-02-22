const User = require('../models/User');
const Vote = require('../models/User');
const Form = require('../models/User');
const News = require('../models/User');
const VideoContent = require('../models/User');
const HouseMate = require('../models/User');
const Post = require('../models/User');

const createSeason = async (req, res) => {
    const { title, description, subtitle, year, duration, createdBy } = req.body;

    try {
        // Fetch the user by their ID
        const creator = await User.findById(createdBy);
        if (!creator) {
            return res.status(404).json({
                status: 'failed',
                message: 'Creator not found'
            });
        }

        // Create the season with the provided data
        const newSeason = new Season({
            title,
            description,
            subtitle,
            year,
            duration,
            createdBy: creator // Assign the creator to the season
        });

        // Save the season to the database
        const savedSeason = await newSeason.save();

        return res.status(201).json({
            status: 'success',
            message: 'Season created successfully',
            season: savedSeason
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

}

module.exports = season
