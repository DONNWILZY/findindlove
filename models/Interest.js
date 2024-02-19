const mongoose = require('mongoose');

const InterestSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    
    // User's preferences for finding matches
    genderPreference: {
        type: String,
        enum: ['male', 'female', 'any']
    },
    ageRange: {
        min: {
            type: Number,
            min: 18,
            max: 99
        },
        max: {
            type: Number,
            min: 18,
            max: 99
        }
    },
    locationPreference: {
        type: String
    },
    interests: {
        type: [String]
    },
    physicalAttributes: {
        height: String,
        bodyType: String,
        hairColor: String
    },
    personalityTraits: {
        type: [String]
    },
    relationshipType: {
        type: String
    },
    compatibilityQuestions: {
        type: Map,
        of: String
    },
    dealbreakers: {
        type: [String]
    },


    // User's own persona attributes
    gender: {
        type: String,
        enum: ['male', 'female', 'other']
    },
    age: {
        type: Number,
        min: 18,
        max: 99
    },
    location: {
        type: String
    },
    interests: {
        type: [String]
    },
    
});

const Interest = mongoose.model('Interest', InterestSchema);
module.exports = Interest;
