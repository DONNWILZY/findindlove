// config.js


// Load environment variables
const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    googleClientId:  process.env.googleClientId,
    googleClientSecret: process.env.googleClientSecret,
  };
  
  
