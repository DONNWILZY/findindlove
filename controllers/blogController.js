const mongoose = require('mongoose');
const Models = require('../models');
const News = Models.news;
const User = Models.user;
const Reaction = Models.reaction
const Season = Models.season;
const Comment = Models.comment;



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




const updateNews = async (userId, title, content, images, featuredImage, keywords, season, autoSchedule, scheduledDate, allowComment, allowReaction, Promo, featured, latest, exclusive, notifyAdmin, notifyUser, manualAuthorName, userMentions, postId) => {
    try {
        // Check if postId exists, if yes, update the post; otherwise, create a new post
        let news;
        if (postId) {
            // Update existing post
            news = await News.findById(postId);
            if (!news) {
                throw new Error('Post not found');
            }

            // Update fields
            news.title = title;
            news.content = content;

            // Check if autoSchedule is true and scheduledDate is provided
            if (autoSchedule && scheduledDate) {
                news.autoSchedule = autoSchedule;
                news.scheduledDate = scheduledDate;
                news.scheduleStatus = 'Scheduled'; // Update schedule status
            } else {
                // If autoSchedule is false or scheduledDate is not provided
                news.autoSchedule = false;
                news.scheduledDate = null;
                news.scheduleStatus = 'Posted'; // Update schedule status
            }

            // Update other fields accordingly...
        } else {
            // Create new post
            news = new News({
                userId,
                title,
                content,
                images,
                featuredImage,
                keywords,
                season,
                autoSchedule,
                scheduledDate,
                allowComment,
                allowReaction,
                Promo,
                featured,
                latest,
                exclusive,
                notifyAdmin,
                notifyUser,
                manualAuthorName,
                userMentions
            });

            // Set schedule status
            news.scheduleStatus = autoSchedule ? 'Scheduled' : 'Posted';
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

        // Update or create the news post instance
        news.content = modifiedContent; // Use modified content with mentions included
        await news.save();

        return { success: true, message: 'News post created or updated successfully.', news };
    } catch (error) {
        console.error('Error creating or updating news post:', error);
        throw error;
    }
};



const reactToNewsPost = async (userId, newReactionType, newsId) => {
    try {
        // Check if reactions are allowed for the news post
        const newsPost = await News.findById(newsId);
        if (!newsPost) {
            throw new Error('News post not found.');
        }
        if (!newsPost.allowReaction) {
            return { success: false, message: 'Reactions not allowed for this news post.' };
        }

        // Find existing reaction by the user on the news post
        const existingReaction = await Reaction.findOne({ user: userId, activityType: 'news', activityId: newsId });

        // Check if the user has already reacted to the news post with the same reaction type
        if (existingReaction && existingReaction.reactionType === newReactionType) {
            // If the user has already reacted with the same reaction type, unreact
            await Reaction.deleteOne({ _id: existingReaction._id }); // Remove the existing reaction document
            return { success: true, message: 'User unreacted successfully.' };
        }

        // If the user has not already reacted or reacted with a different type, proceed to react
        if (existingReaction) {
            // If the user has already reacted with a different type, update the reaction
            existingReaction.reactionType = newReactionType;
            const updatedReaction = await existingReaction.save();
            return { success: true, message: 'Reaction updated successfully.', reaction: updatedReaction };
        } else {
            // Create a new reaction document
            const reaction = new Reaction({
                user: userId,
                reactionType: newReactionType,
                activityType: 'news',
                activityId: newsId
            });

            // Save the new reaction to the database
            const savedReaction = await reaction.save();

            // Return the created reaction document
            return { success: true, message: 'Reaction added successfully.', reaction: savedReaction };
        }
    } catch (error) {
        console.error('Error reacting to news post:', error);
        return { success: false, message: 'Error reacting to news post.', error: error.message };
    }
};


const addCommentToNewsPost = async (userId, content, newsId) => {
    try {
        // Check if commenting is allowed for the news post
        const newsPost = await News.findById(newsId);
        if (!newsPost) {
            throw new Error('News post not found.');
        }
        if (!newsPost.allowComment) {
            return { success: false, message: 'Commenting is not allowed for this news post.' };
        }

        // Create a new comment document
        const comment = new Comment({
            user: userId,
            content,
            activityType: 'news',
            activityId: newsId
        });

        // Save the new comment to the database
        const savedComment = await comment.save();

        // Return success message and the saved comment
        return { success: true, message: 'Comment added successfully.', comment: savedComment };
    } catch (error) {
        console.error('Error adding comment to news post:', error);
        return { success: false, message: 'Error adding comment to news post.', error: error.message };
    }
};

const reactToComment = async (userId, newReactionType, commentId) => {
    try {
        // Check if reactions are allowed for the comment
        const comment = await Comment.findById(commentId);
        if (!comment) {
            throw new Error('Comment not found.');
        }

        // Find existing reaction by the user on the comment
        const existingReaction = await Reaction.findOne({ user: userId, activityType: 'newsComment', activityId: commentId });

         // Check if the user has already reacted to the news post with the same reaction type
         if (existingReaction && existingReaction.reactionType === newReactionType) {
            // If the user has already reacted with the same reaction type, unreact
            await Reaction.deleteOne({ _id: existingReaction._id }); // Remove the existing reaction document
            return { success: true, message: 'User unreacted successfully.' };
        }

        // If the user has not already reacted or reacted with a different type, proceed to react
        if (existingReaction) {
            // If the user has already reacted with a different type, update the reaction
            existingReaction.reactionType = newReactionType;
            const updatedReaction = await existingReaction.save();
            return { success: true, message: 'Reaction updated successfully.', reaction: updatedReaction };
        } else {
            // Create a new reaction document
            const reaction = new Reaction({
                user: userId,
                reactionType: newReactionType,
                activityType: 'newsComment',
                activityId: commentId
            });

            // Save the new reaction to the database
            const savedReaction = await reaction.save();

            // Return the created reaction document
            return { success: true, message: 'Reaction added successfully.', reaction: savedReaction };
        }
    } catch (error) {
        console.error('Error reacting to comment:', error);
        return { success: false, message: 'Error reacting to comment.', error: error.message };
    }
};














const blog = {
    createNewsPost,
    updateNews,
    reactToNewsPost,
    addCommentToNewsPost,
    reactToComment
    

}
module.exports = blog

