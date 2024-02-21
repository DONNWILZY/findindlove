const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose  = require('mongoose');
const connectToDatabase = require('./config/db');
connectToDatabase(); // database function
dotenv.config();

app.use(express.json());


const PORT = process.env.PORT || 5000
////// URL FOR THE PROJECT
const prodUrl = `http://127.0.0.1:${PORT}` ;
const liveUrl =  `${process.env.currentUrl}:${PORT}`
const currentUrl = liveUrl ||  prodUrl  



app.listen(PORT, ()=>{
    console.log(`Connected on PORT ${PORT} || ${currentUrl}`)
  })