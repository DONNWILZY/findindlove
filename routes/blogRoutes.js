const express = require('express');
const router = express.Router();

const {verifyToken, 
    verifyUser, 
    verifyAdmin, 
    verifyStaff, 
    verifySuperAdmin, 
    checkPermission} = require('../middlewares/authMiddleware');


const {createNewsPost, 
  updateNews, 
  reactToNewsPost, 
  addCommentToNewsPost, 
  reactToComment, 
  replyToComment, 
  reactToCommentReply,
  getNewsWithCommentsAndReplies} = require('../controllers/blogController');

// route to fill a form
// router.post('/create', verifyToken, createNewsPost);

router.post('/create', verifyToken,checkPermission('create_News'), (req, res) => {
  // Custom logic if needed
  createNewsPost(req.body.userId, 
    req.body.title, 
    req.body.content,
    req.body.images,
    req.body.featuredImage,
    req.body.keywords,
    req.body.season,
    req.body.autoSchedule,
    req.body.scheduledDate,
    req.body.allowComment,
    req.body.allowReaction,
    req.body.Promo,
    req.body.featured,
    req.body.latest,
    req.body.exclusive,
    req.body.notifyAdmin,
    req.body.notifyUser,
    req.body.manualAuthorName,
    req.body.tags,
    req.body.user




      )
      .then(result => {
          // Handle the result
          res.send(result);
      })
      .catch(error => {
          // Handle errors
          console.error(error);
          res.status(500).send('Internal Server Error');
      });
});



router.put('/update/:postId', async (req, res) => {
  const postId = req.params.postId;
  const {
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
      userMentions // Add userMentions to the request body
  } = req.body;

  try {
      const result = await updateNews(userId, title, content, images, featuredImage, keywords, season, autoSchedule, scheduledDate, allowComment, allowReaction, Promo, featured, latest, exclusive, notifyAdmin, notifyUser, manualAuthorName, userMentions, postId);
      res.json(result);
  } catch (error) {
      res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
  }
});

// Route to react to a news post
router.post('/react', async (req, res) => {
  try {
      const { userId, reactionType, newsId } = req.body;
      const reactionResult = await reactToNewsPost(userId, reactionType, newsId);
      res.json(reactionResult);
  } catch (error) {
      console.error('Error in reacting to news post:', error);
      res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

// POST route to add a comment to a news post
router.post('/comment/:newsId', async (req, res) => {
  try {
      const { userId, content } = req.body;
      const { newsId } = req.params;
      
      const result = await addCommentToNewsPost(userId, content, newsId);
      
      if (result.success) {
          res.status(201).json(result);
      } else {
          res.status(400).json(result);
      }
  } catch (error) {
      console.error('Error adding comment to news post:', error);
      res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});


// Route to react to a comment
router.post('/react/:commentId/', async (req, res) => {
  try {
      const { userId, reactionType } = req.body;
      const { commentId } = req.params;
      
      const reactionResult = await reactToComment(userId, reactionType, commentId);
      
      if (reactionResult.success) {
          return res.status(200).json(reactionResult);
      } else {
          return res.status(400).json(reactionResult);
      }
  } catch (error) {
      console.error('Error in reacting to comment:', error);
      return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});



router.post('/comment/reply/:commentId', async (req, res) => {
  const { userId, content } = req.body;
  const { commentId } = req.params;

  try {
      const result = await replyToComment(userId, content, commentId);
      res.status(200).json(result);
  } catch (error) {
      res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});


// Route to react to a comment reply

router.post('/ract/reply/:replyId', async (req, res) => {
  const { userId, newReactionType, replyId } = req.body;
  try {
      const reactionResult = await reactToCommentReply(userId, newReactionType, replyId);
      res.json(reactionResult);
  } catch (error) {
      console.error('Error reacting to comment reply:', error);
      res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

// Route to get a single news post with comments, replies, and reactions
router.get('/news/:newsId', async (req, res) => {
    const newsId = req.params.newsId;
    try {
        const newsPost = await getNewsWithCommentsAndReplies(newsId);
        res.json(newsPost);
    } catch (error) {
        console.error('Error fetching news post with comments and replies:', error);
        res.status(500).json({ success: false, message: 'Internal server error.' });
    }
});







  module.exports = router;