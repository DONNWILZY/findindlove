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

  username: {
    type: String,
    required: true,
  },

  dateOfBirth: {
    type: Date,
  },

  gender: {
    type: String,
    enum: ['male', 'female', 'not set'],
    default: 'not set',

  },

  nationality: {
    type: String,
    // required: true,
  },

  phone: {
    type: Number,
    unique: true,
    sparse: true,
    // default: null//
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  isHouseMate: {
    type: Boolean
  },

  password: {
    type: String,
    required: true,
  },

  activityLog: {
    type: Boolean
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
    // required: true,
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
    action: {
      type: String,
      enum: ['online', 'offline', 'blocked', 'suspended',],
      default: 'online',
    },

    duration: {
      type: String,
    },
    durationType: {
      type: String,
      enum: ['hours', 'days', 'months', 'year']
    }
  },


  role: {
    type: String,
    enum: ['user', 'admin', 'superAdmin', 'staff'],
    default: 'user',
  },
  permissions: [{
    type: String,
  }],

  occupation: {
    type: String,
  },


  twofactorAuth: {
    type: Boolean,
    default: false,
  },

  nextOfKin: {
    fullName: {
      type: String,
      // required: true,
    },
    phoneNumber: {
      type: String,
      // required: true,
    },
    email: {
      type: String,
    },
    relationship: {
      type: String,
    },
  },

  // updateNotification: {
  //   email: {
  //     type: Boolean,
  //     default: true
  //   },
  //   inapp: {
  //     type: Boolean,
  //     default: true
  //   },
  //   sms: {
  //     type: Boolean,
  //     default: true
  //   }
  // },

  season: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Season',
  },

  matched: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },

  following: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  blockedFollowers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],

  posts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  }],
  news: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'News'
  }],
  votes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vote'
  }],

  forms: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Form'
  }],

  userSettings: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserSettings'
  }],

  videoContent: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'VideoContent'
  }],

  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  CommentReplies: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CommentReply'
  }],
  devicePermission: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DevicePermission'
  }],
  interests: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Interest'
  }],
  notification: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Notification'
  }],

  reactions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Reaction'
  }],

  location: {
    address: {
      type: String,
      // required: true,
    },
    city: {
      type: String,
      // required: true,
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
    timestamps: true,
  });

module.exports = mongoose.model('User', userSchema);
