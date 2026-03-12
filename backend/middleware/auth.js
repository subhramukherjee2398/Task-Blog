const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production-12345';

// Protect routes - verify JWT token
const protect = async (req, res, next) => {
  console.log('Protect middleware called');
  let token;

  // Get token from cookie
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  // Check if token exists
  if (!token) {
    console.log('No token found');
    return res.status(401).json({ message: 'Not authorized, please log in' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('Decoded token:', decoded);

    // Get user from token
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      console.log('User not found for ID:', decoded.userId);
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user;
    console.log('User authenticated:', user.email);
    next();
  } catch (err) {
    console.log('Error in protect middleware:', err.message);
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired, please log in again' });
    }
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Optional auth - attach user if token exists, but don't require it
const optionalAuth = async (req, res, next) => {
  let token;

  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = await User.findById(decoded.userId).select('-password');
    } catch (err) {
      // Token invalid, but continue without user
      req.user = null;
    }
  }

  next();
};

module.exports = { protect, optionalAuth, JWT_SECRET };
