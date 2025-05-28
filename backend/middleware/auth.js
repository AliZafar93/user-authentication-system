// backend/middleware/auth.js

const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Ensure this path is correct

/**
 * Authentication middleware.
 * Verifies a JWT token from the Authorization header.
 * If valid, attaches the user object (without password) to the request object.
 */
module.exports = async (req, res, next) => {
  // Get token from header. Expected format: "Bearer <token>"
  const authHeader = req.header('Authorization');

  if (!authHeader) {
    return res.status(401).json({ message: 'No token, authorization denied. Header missing.' });
  }

  const tokenParts = authHeader.split(' ');

  if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
    return res.status(401).json({ message: 'Token is not valid. Format should be "Bearer <token>".' });
  }

  const token = tokenParts[1];

  if (!token) {
    return res.status(401).json({ message: 'No token found after "Bearer ", authorization denied.' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Add user from payload
    // Find user by ID from token payload and exclude the password field
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
        // This case might happen if the user was deleted after the token was issued
        return res.status(401).json({ message: 'User not found for this token.' });
    }

    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    console.error('Token verification error:', err.message);
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({ message: 'Invalid token.' });
    }
    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token expired.' });
    }
    res.status(500).json({ message: 'Server error during token validation.' });
  }
};
