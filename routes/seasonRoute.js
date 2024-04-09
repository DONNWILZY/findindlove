const express = require('express');
const router = express.Router();
const {createSeason, addHousematesToSeason} = require('../controllers/seasonController');
const {verifyToken, verifyUser, verifyAdmin, verifyStaff, verifySuperAdmin, checkPermission} = require('../middlewares/authMiddleware');


// POST route to create a season
router.post('/create', verifyToken, checkPermission('create_season'),  createSeason);

// Route for adding housemates to a season
router.post('/housemate/add/:seasonId', addHousematesToSeason);












module.exports = router;