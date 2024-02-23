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

// Middleware to verify admin role
const verifyAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);

    if (user && user.role === 'admin') {
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

    if (user && user.role === 'user') {
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

    if (user && user.role === 'staff') {
      next();
    } else {
      return next(new AppError('You are not a verified STAFF', 401));
    }
  } catch (error) {
    console.error("Middleware Error:", error);
    res.status(500).json({ error: 'An error occurred while processing the request.' });
  }
};

// Middleware to verify user role and permissions
const checkPermission = (requiredPermission) => {
  return async (req, res, next) => {
    try {
      const user = await User.findById(req.user.userId); // Find user by ID
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }

      const userRole = user.role; // Accessing role from user model
      const userPermissions = user.permissions || [];

      if (userRole === 'superAdmin') {
        // If user is superAdmin, authorize them
        next(); 
      } else if (user.role === 'admin' || user.role === 'moderator' && userPermissions.includes(requiredPermission)) {
        // If user has the required permission, authorize them
        next(); 
      } else {
        // User doesn't have the required permission, deny access
        res.status(403).json({ message: "You don't have permission to access this resource." });
      }
    } catch (error) {
      console.error("Error while checking permissions:", error);
      res.status(500).json({ message: "Internal server error." });
    }
  };
};




module.exports = {
  AppError,
  verifyToken,
  verifyUser,
  verifySuperAdmin,
  verifyAdmin,
  verifyStaff,
  checkPermission
};