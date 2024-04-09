const mongoose = require('mongoose');
const crypto = require('crypto');
const dotenv = require('dotenv');
dotenv.config();
const Transaction = require('./Transaction');
// Retrieve the encryption key from the environment variable
const encryptionKey = process.env.ENCRYPTION_KEY;






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

contest:{
  isHouseMate: {
    type: Boolean
  },
  
  season: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Season',
  },

  matched: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },

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
        type: Number, // Store encrypted balance as a string
        // required: true,
        // default: 0
    },
    currency: {
        type: String,
        enum: ['USD', 'NGN'],
        default: 'NGN',
        // required: true,
    },
    votePoints: {
        type: Number, // Store encrypted votePoints as a string
        // required: true,
        default: 0
    },
    referralPoints: {
        type: Number, // Store encrypted referralPoints as a string
        // required: true,
        default: 0
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
      default: false
    },

    duration: {
      type: Number,
      // default: 10,

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
  const encryptionKey = process.env.ENCRYPTION_KEY;

  // Encrypt wallet fields
  if (user.wallet.balance) {
    user.wallet.balance = encrypt(user.wallet.balance, encryptionKey);
  }
  if (user.wallet.votePoints) {
    user.wallet.votePoints = encrypt(user.wallet.votePoints, encryptionKey);
  }
  if (user.wallet.referralPoints) {
    user.wallet.referralPoints = encrypt(user.wallet.referralPoints, encryptionKey);
  }

  next();
});

// // Decrypt wallet data after fetching
// UserSchema.post('init', function(doc) {
//   const encryptionKey = process.env.ENCRYPTION_KEY;

//   // Decrypt wallet fields
//   if (doc.wallet.balance) {
//     doc.wallet.balance = decrypt(doc.wallet.balance, encryptionKey);
//   }
//   if (doc.wallet.votePoints) {
//     doc.wallet.votePoints = decrypt(doc.wallet.votePoints, encryptionKey);
//   }
//   if (doc.wallet.referralPoints) {
//     doc.wallet.referralPoints = decrypt(doc.wallet.referralPoints, encryptionKey);
//   }
// });


// // Encryption function using AES
// function encrypt(data, key) {
//   // Check if the encryption key meets the required length
//   if (key.length !== 32) {
//       throw new Error('Invalid encryption key length. Expected length: 32 bytes (256 bits).');
//   }

//   const iv = crypto.randomBytes(16); // Generate a random initialization vector
//   const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
//   let encryptedData = cipher.update(data.toString(), 'utf-8', 'hex');
//   encryptedData += cipher.final('hex');
//   return `${iv.toString('hex')}:${encryptedData}`;
// }

// // Decryption function using AES
// function decrypt(encryptedData, key) {
//   // Check if the encryption key meets the required length
//   if (key.length !== 32) {
//       throw new Error('Invalid encryption key length. Expected length: 32 bytes (256 bits).');
//   }

//   if (!encryptedData) {
//       return ''; // or handle the error gracefully
//   }

//   const [iv, encryptedDataWithoutIV] = encryptedData.split(':');
//   const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), Buffer.from(iv, 'hex'));
//   let decryptedData = decipher.update(encryptedDataWithoutIV, 'hex', 'utf-8');
//   decryptedData += decipher.final('utf-8');
//   return decryptedData;
// }



const User = mongoose.model('User', UserSchema);
module.exports = User
