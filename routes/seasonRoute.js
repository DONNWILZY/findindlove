const express = require('express');
const router = express.Router();
const {createSeason, addHousematesToSeason, addHouseMatesToMatch, acceptMatch} = require('../controllers/seasonController');
const {verifyToken, verifyUser, verifyAdmin, verifyStaff, verifySuperAdmin, checkPermission} = require('../middlewares/authMiddleware');


// POST route to create a season
router.post('/create', verifyToken, checkPermission('create_season'),  createSeason);

// Route for adding housemates to a season
router.post('/housemate/add/:seasonId', addHousematesToSeason);


// Route to add housemates to a match
router.post('/match/add', async (req, res) => {
    const { maleHouseMateId, femaleHouseMateId, seasonId } = req.body;
    try {
        const match = await addHouseMatesToMatch(maleHouseMateId, femaleHouseMateId, seasonId);
        res.status(201).json({ success: true, match });
    } catch (error) {
        console.error('Error adding housemates to match:', error);
        res.status(500).json({ success: false, message: 'Failed to add housemates to match' });
    }
});



// Route to accept a match
router.put('/match/accept/:matchId', verifyToken, async (req, res) => {
    const { userId } = req.body; // Extract userId from the request body
    const matchId = req.params.matchId;

    try {
        const updatedMatch = await acceptMatch(userId, matchId);
        res.status(200).json({ status: 'success', message: 'Match accepted successfully', match: updatedMatch });
    } catch (error) {
        console.error('Error accepting match:', error);
        res.status(500).json({ status: 'failed', message: 'Failed to accept match' });
    }
});




  





module.exports = router;