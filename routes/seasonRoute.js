const express = require('express');
const router = express.Router();
const {createSeason} = require('../controllers/seasonController');

// POST route to create a season
router.post('/create', createSeason);












module.exports = router;