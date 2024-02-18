const mongoose = require('mongoose');

const SeasonSchema = new mongoose.Schema({
    title: {
        type: String
    },
    description: {
        type: String
    }
});

const Season = mongoose.model('Season', SeasonSchema);

module.exports = Season;
