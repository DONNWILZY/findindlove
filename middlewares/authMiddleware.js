const express = require("express");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const User  = require('../models/User'); 
dotenv.config();

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Custom error class
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Middleware to verify JWT token
const verifyToken = async (req, res, next) => {
  const bearerHeader = req.headers["authorization"];

  if (!bearerHeader) {
    return res.status(403).json({
      status: 403,
      message: "You are not authenticated",
    });
  }

  const [, bearerToken] = bearerHeader.split(" ");
  req.token = bearerToken;

  try {
    const user = jwt.verify(req.token, process.env.JWT_SEC_KEY);
    req.user = user;
    next();
  } catch (err) {
    return next(new AppError("Token is not valid or expired", 403));
  }
};

// Middleware to verify super admin role
const verifySuperAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);

    if (user && user.role === "superAdmin") {
      next();
    } else {
      return next(new AppError("You are not a SUPER ADMIN", 401));
    }
  } catch (error) {
    console.error("Middleware Error:", error);
    res.status(500).json({ error: "An error occurred while processing the request." });
  }
};

// Middleware to verify admin or user role
const verifyAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);

    if (user && (user.role === 'admin')) {
      next();
    } else {
      return next(new AppError('You are not an ADMIN', 401));
    }
  } catch (error) {
    console.error('Middleware Error:', error);
    res.status(500).json({ error: 'An error occurred while processing the request.' });
  }
};

// Middleware to verify user role
const verifyUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);

    if (user.role === 'user') {
      next();
    } else {
      return next(new AppError('You are not a verified USER', 401));
    }
  } catch (error) {
    console.error("Middleware Error:", error);
    res.status(500).json({ error: 'An error occurred while processing the request.' });
  }
};

// Middleware to verify staff role
const verifyStaff = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);

    if (user.role === 'staff') {
      next();
    } else {
      return next(new AppError('You are not a verified STAFF', 401));
    }
  } catch (error) {
    console.error("Middleware Error:", error);
    res.status(500).json({ error: 'An error occurred while processing the request.' });
  }
};


module.exports = {
  AppError,
  verifyToken,
  verifyUser,
  verifySuperAdmin,
  verifyAdmin,
  verifyStaff,
};