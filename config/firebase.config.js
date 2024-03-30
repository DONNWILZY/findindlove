// config/firebase.config.js

// Import Firebase SDK
const { initializeApp } = require("firebase/app");

// Load environment variables
const dotenv = require('dotenv');
dotenv.config();

// Firebase configuration object
const firebaseConfig = {
  apiKey: process.env.apiKey,
  authDomain: process.env.authDomain,
  projectId: process.env.projectId,
  storageBucket: process.env.storageBucket,
  messagingSenderId: process.env.messagingSenderId,
  appId: process.env.appId
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Export the Firebase configuration object
module.exports = { firebaseConfig };
