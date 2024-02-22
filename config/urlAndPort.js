// config/urlAndPort.js

const dotenv = require('dotenv');
dotenv.config();



const port = process.env.PORT || 5000;

// URL FOR THE PROJECT
const prodUrl = `http://127.0.0.1:${port}`;
const liveUrl = `${process.env.currentUrl}:${port}`;
const currentUrl = liveUrl || prodUrl;

module.exports = {
  port,
  currentUrl
};
