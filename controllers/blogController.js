const mongoose = require('mongoose');
const News = require('../models/News');
const Season = require('../models/Season');
const User = require('../models/User');
const houseMates = require('../models/User');


const createNewsPost = async (userId, title, content, images, featuredImage, keywords, season, autoSchedule, scheduledDate, allowComment, allowReaction, Promo, featured, latest, exclusive, notifyAdmin, notifyUser, manualAuthorName, users) => {
    try {
        // Fetch the authenticated user
        let createdBy = await User.findById(userId);
        if (!createdBy) {
            throw new Error('Authenticated user not found.');
        }

        // Determine the author's name based on the provided parameters
        let authorName;
        if (manualAuthorName) {
            // If manualAuthorName is provided, use it as the author's name
            authorName = manualAuthorName;
        } else {
            // Otherwise, use the user's firstName and lastName
            authorName = `${createdBy.firstName} ${createdBy.lastName}`;
        }

        // Set the initial status based on autoSchedule
        let scheduleStatus = autoSchedule ? 'Scheduled' : 'Posted';

        // If autoSchedule is true and no scheduledDate is provided, or scheduledDate is null, throw an error
        if (autoSchedule && (scheduledDate === undefined || scheduledDate === null)) {
            throw new Error('Scheduled date must be provided when autoSchedule is true.');
        } else if (!autoSchedule && scheduledDate !== undefined) {
            // If autoSchedule is false and scheduledDate is provided, log a warning
            console.warn('Scheduled date is provided but autoSchedule is false. Ignoring scheduledDate.');
        }

        // Find mentioned users based on the content
        const mentionedUsers = await User.find({ username: { $in: extractMentions(content) } });

        // Extract usernames from mentioned users
        const mentionedUsernames = mentionedUsers.map(user => user.username);

        // Replace mentions of users in the content
        let modifiedContent = content;
        mentionedUsernames.forEach(username => {
            const mentionRegex = new RegExp(`@${username}`, 'g');
            modifiedContent = modifiedContent.replace(mentionRegex, `@${username}`); // Replace @username with @username
        });

        // Create the news post instance
        const news = new News({
            title,
            content: modifiedContent, // Use modified content with mentions included
            images,
            featuredImage,
            keywords,
            season,
            createdBy: createdBy._id,
            author: authorName,
            autoSchedule,
            scheduledDate,
            scheduleStatus,
            allowComment,
            allowReaction,
            Promo,
            featured,
            latest,
            exclusive,
            notifyAdmin,
            notifyUser,
            user: mentionedUsers.map(user => user._id) // Store references to mentioned users
        });

        // Save the news post to the database
        await news.save();
        console.log('News post created successfully.');
        return { success: true, message: 'News post created successfully.', news };
    } catch (error) {
        console.error('Error creating news post:', error);
        return { success: false, message: 'Error creating news post.', error: error.message }; // Return error message
    }
};

// Function to extract mentions from content
const extractMentions = (content) => {
    // Regular expression to match mentions in the content
    const mentionRegex = /@(\w+)/g;
    const matches = content.match(mentionRegex);
    if (matches) {
        // Extract usernames from matches
        return matches.map(match => match.slice(1));
    } else {
        return [];
    }
};



const blog = {
    createNewsPost
}
module.exports = blog
