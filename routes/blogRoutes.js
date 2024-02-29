const express = require('express');
const router = express.Router();

const {verifyToken, 
    verifyUser, 
    verifyAdmin, 
    verifyStaff, 
    verifySuperAdmin, 
    checkPermission} = require('../middlewares/authMiddleware');


const {createNewsPost, updateNews} = require('../controllers/blogController');

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







  module.exports = router;