const express = require('express');
const app = express();
const nodemailer = require('nodemailer');

const mongoose  = require('mongoose');

const connectToDatabase = require('./config/db');
connectToDatabase(); // database function

const dotenv = require('dotenv');
dotenv.config();

app.use(express.json());

// Import route initializer
const initializeRoutes = require('./config/routeInitializer');

// Initialize routes
initializeRoutes(app);


// Import port configuration
const { port, currentUrl } = require('./config/urlAndPort');


app.get('/', (req, res) =>{
  res.send( `DEFAULT ROUTE IS WORKING`);
  
});


app.listen(port, () => {
  console.log(`Connected on PORT ${port} || ${currentUrl}`);
});