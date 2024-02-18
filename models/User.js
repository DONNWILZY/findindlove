const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

systemNumber: {
    type: Number,
    unique: true, 
  },
  
  firstName: {
    type: String,
    required: true,
  },

  middleName: {
    type: String,
  },

  lastName: {
    type: String,
    required: true,
  },

  dateOfBirth: {
    type: Date, // required: true,
  },

  gender: {
    type: String,
    enum: ['male', 'female', 'not set'],
    default: 'not set',
    //required: true
},

  nationality: {
    type: String,
    required: true,
  },

  phone: {
    type: Number,
    unique: true,
    sparse: true,
    default: null 
},

  email:{
    type: String,
    required: true,
    unique: true,
  },

  isHouseMate:{
    type: Bolean
  },
  
   password:{
    type: String,
    required: true,
  }, 

  activityLog:{
    type: Bolean
  },

  wallet: {
    balance: {
      type: Number,
      default: 0,
    },
    currency: {
      type: String,
      enums: ['USD', 'NGD'],
      default: 'NGN',
    },
    votePoints: {
      type: Number,
      default: 0,
    },
    referralPoints: {
      type: Number,
      default: 0,
    },
  }, 


  passwordHistory: {
    type: [String],
    items: {
      type: String,
    },
    maxItems: 5,
  },

  passwordUpdatedAt: {
    type: Date,
  }, 
 
  transactionPIN: {
    type: String,
    required: true,
  }, // Hashed separately

  oldPins: {
    type: [String],
  },

  pinUpdatedAt: {
    type: Date,
  }, // Timestamp for transaction PIN changes

  displayPhoto: {
    type: String,
  },

  images: {
    type: [String],
    validate: [arrayLimit, '{PATH} exceeds the limit of 5'],
    default: []
},

idcard: {
    type: String,
  },

  
  isPhoneVerified: {
    type: Boolean,
    default: false,
  },

  isEmailVerified: {
    type: Boolean,
    default: false,
  },

  isIDVerified: {
    type: Boolean,
    default: false,
  },

  accountStatus: {
    type: String,
    enum: ['online', 'offline', 'blocked', 'suspended',  ],
    default: 'online',
  },


  role: {
    type: String,
    enum: ['user', 'admin', 'superAdmin', 'Moderator',  ],
    default: 'user',
  },

   occupation: {
    type: String,
  },


  twofactorAuth:{
    type: Boolean,
    default: false,
  },

  nextOfKin: {
    fullName: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    relationship: {
      type: String,
    },
  },

  updateNotification: {
    email:{
      type: Bolean
    },
    inapp:{
      type: Bolean
    },
    sms:{

    }
  }, 

  location: {
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
    },
    country: {
      type: String,
    },
  },
},
{
  timestamps: true, // Automatically add createdAt and updatedAt timestamps
});

module.exports = mongoose.model('User', userSchema);
