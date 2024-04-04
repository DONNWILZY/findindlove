const mongoose = require('mongoose');
const crypto = require('crypto');
require('dotenv').config();
const Transaction = require('./Transaction');
//bcrypt 
const bcrypt = require("bcrypt");


// Encryption and decryption functions using AES
function encrypt(data, key) {
  const iv = crypto.randomBytes(16); // Generate a random initialization vector
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
  let encryptedData = cipher.update(data, 'utf-8', 'hex');
  encryptedData += cipher.final('hex');
  return { iv: iv.toString('hex'), encryptedData };
}

function decrypt(encryptedData, iv, key) {
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), Buffer.from(iv, 'hex'));
  let decryptedData = decipher.update(encryptedData, 'hex', 'utf-8');
  decryptedData += decipher.final('utf-8');
  return decryptedData;
}



const UserSchema = new mongoose.Schema({

  systemNumber: {
    type: Number,
    unique: true,
  },

  avatar: {
    type: String,
    default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
},

  firstName: {
    type: String,
    // required: true,
  },

  middleName: {
    type: String,
  },

  lastName: {
    type: String,
    // required: true,
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
    // required: true,
  },

  activityLog: {
    type: Boolean
  },

  wallet: {
    balance: {
        type: String, // Store encrypted balance as a string
        required: true,
    },
    currency: {
        type: String,
        enum: ['USD', 'NGD'],
        default: 'NGN',
        required: true,
    },
    votePoints: {
        type: String, // Store encrypted votePoints as a string
        required: true,
    },
    referralPoints: {
        type: String, // Store encrypted referralPoints as a string
        required: true,
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

    isBlocked:{
      type: Boolean,
      default: true
    },

    duration: {
      type: Number,
      default: 32

    },
    durationType: {
      type: String,
      enum: ['hours', 'days', 'months', 'year'],
      default: 'days'
    },

    startTime:{
      type: Date,
      default: Date.now
    },
    
    endTime:{
      type: Date,
     
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

  position: {
    type: String
  },

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

  reply: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CommentReply'
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
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  });


  UserSchema.virtual('balance').get(function() {
    return new Promise(async (resolve, reject) => {
        try {
            // Fetch all completed incoming transactions (deposits, payments received)
            const incomingTransactions = await Transaction.find({ user: this._id, type: 'income', status: 'completed' });

            // Fetch all completed outgoing transactions (withdrawals, payments made)
            const outgoingTransactions = await Transaction.find({ user: this._id, type: 'expense', status: 'completed' });

            // Calculate total incoming amount
            const totalIncomingAmount = incomingTransactions.reduce((acc, transaction) => acc + transaction.amount, 0);

            // Calculate total outgoing amount
            const totalOutgoingAmount = outgoingTransactions.reduce((acc, transaction) => acc + transaction.amount, 0);

            // Calculate balance by subtracting total outgoing from total incoming
            const balance = totalIncomingAmount - totalOutgoingAmount;

            resolve(balance);
        } catch (error) {
            console.error('Error calculating user balance:', error);
            reject(new Error('Failed to calculate user balance.'));
        }
    });
});

UserSchema.pre('save', async function(next) {
  const user = this;

  // Calculate endTime based on startTime, duration, and durationType
  if (user.accountStatus.action === 'blocked' && user.accountStatus.startTime) {
      const { startTime, duration, durationType } = user.accountStatus;
      let endTime;

      switch (durationType) {
          case 'hours':
              endTime = new Date(startTime.getTime() + duration * 3600000); // 1 hour = 3600000 milliseconds
              break;
          case 'days':
              endTime = new Date(startTime.getTime() + duration * 86400000); // 1 day = 86400000 milliseconds
              break;
          case 'months':
              // Not precise, but adding 30 days for simplicity
              endTime = new Date(startTime.getTime() + duration * 30 * 86400000);
              break;
          case 'year':
              // Not precise, but adding 365 days for simplicity
              endTime = new Date(startTime.getTime() + duration * 365 * 86400000);
              break;
          default:
              // Default to days
              endTime = new Date(startTime.getTime() + duration * 86400000);
              break;
      }

      user.accountStatus.endTime = endTime;
  }

  next();
});


// Encrypt wallet data before saving
UserSchema.pre('save', function(next) {
  const user = this;
  const encryptionKey = process.env.ENCRYPTION_KEY; // Your encryption key

  // Encrypt balance
  const { iv: balanceIV, encryptedData: balanceEncryptedData } = encrypt(user.wallet.balance, encryptionKey);
  user.wallet.balance = `${balanceIV}:${balanceEncryptedData}`;

  // Encrypt votePoints
  const { iv: votePointsIV, encryptedData: votePointsEncryptedData } = encrypt(user.wallet.votePoints, encryptionKey);
  user.wallet.votePoints = `${votePointsIV}:${votePointsEncryptedData}`;

  // Encrypt referralPoints
  const { iv: referralPointsIV, encryptedData: referralPointsEncryptedData } = encrypt(user.wallet.referralPoints, encryptionKey);
  user.wallet.referralPoints = `${referralPointsIV}:${referralPointsEncryptedData}`;

  next();
});

// Decrypt wallet data after fetching
UserSchema.post('init', function(doc) {
  const encryptionKey = process.env.ENCRYPTION_KEY; // Your encryption key

  // Decrypt balance
  const [balanceIV, balanceEncryptedData] = doc.wallet.balance.split(':');
  doc.wallet.balance = decrypt(balanceEncryptedData, balanceIV, encryptionKey);

  // Decrypt votePoints
  const [votePointsIV, votePointsEncryptedData] = doc.wallet.votePoints.split(':');
  doc.wallet.votePoints = decrypt(votePointsEncryptedData, votePointsIV, encryptionKey);

  // Decrypt referralPoints
  const [referralPointsIV, referralPointsEncryptedData] = doc.wallet.referralPoints.split(':');
  doc.wallet.referralPoints = decrypt(referralPointsEncryptedData, referralPointsIV, encryptionKey);
});








const User = mongoose.model('User', UserSchema);
module.exports = User
