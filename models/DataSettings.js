const mongoose = require('mongoose');

const dataSettingsSchema = new mongoose.Schema({

    freeVote:{
        type: Number
    },

    minDeposit:{
        type: Number
    },

    numberOfHouseMate:{
        type: Number
    },

    amountPerVote:{
        type: Number
    },

    duration:{
        type: Number
    }

});

const DataSettings = mongoose.model('dataSettings', dataSettingsSchema);

module.exports = DataSettings;
