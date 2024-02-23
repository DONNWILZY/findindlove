const express = require('express');
const router = express.Router();
const {createSeason} = require('../controllers/seasonController');
const {verifyToken, verifyUser, verifyAdmin, verifyModerator, verifySuperAdmin} = require('../middlewares/authMiddleware');


// POST route to create a season
router.post('/create', verifyToken, verifyAdmin,  createSeason);












module.exports = router;