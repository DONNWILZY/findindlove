const express = require('express');
const app = express();
const nodemailer = require('nodemailer');

const mongoose  = require('mongoose');
const connectToDatabase = require('./config/db');
connectToDatabase(); // database function

const dotenv = require('dotenv');
dotenv.config();

app.use(express.json());

const authRoute = require('./routes/authRoute');

app.use('/api/auth', authRoute);


const PORT = process.env.PORT || 5000
////// URL FOR THE PROJECT
const prodUrl = `http://127.0.0.1:${PORT}` ;
const liveUrl =  `${process.env.currentUrl}:${PORT}`
const currentUrl = liveUrl ||  prodUrl  


app.get('/', (req, res) =>{
  res.send( `DEFAULT ROUTE IS WORKING`)
  
});




app.listen(PORT, ()=>{
    console.log(`Connected on PORT ${PORT} || ${currentUrl}`)
    
  })