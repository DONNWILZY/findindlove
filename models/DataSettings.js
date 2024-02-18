const mongoose = require('mongoose');

const dataSettingsSchema = new mongoose.Schema({

    freeVote:{
        type: Number,
        default: 5 
    },

    minDeposit:{
        type: Number,
        default: 500 // 500 NGR
    },

    votePointConversionRate: {
        type: Number,
        default: 5 // Default rate: 1 vote point = 5 Naira
    },

    userActivityLog:{
        type: Bolean,
        default: false
    }

});

const DataSettings = mongoose.model('dataSettings', dataSettingsSchema);

module.exports = DataSettings;
