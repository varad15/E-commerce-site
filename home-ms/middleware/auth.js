// middleware/auth.js
const jwt = require('jsonwebtoken');

/**
 * Authentication middleware
 * Verifies JWT token and attaches user to request
 */
const authenticate = (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        error: 'Unauthorized',
        message: 'No token provided' 
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach user info to request
    req.user = {
      id: decoded.userId,
      email: decoded.email,
      name: decoded.name
    };

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        error: 'Unauthorized',
        message: 'Invalid token' 
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        error: 'Unauthorized',
        message: 'Token expired' 
      });
    }

    return res.status(500).json({ 
      error: 'Server Error',
      message: 'Authentication failed' 
    });
  }
};

/**
 * Optional authentication middleware
 * Doesn't fail if no token, but attaches user if token is valid
 */
const optionalAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      req.user = {
        id: decoded.userId,
        email: decoded.email,
        name: decoded.name
      };
    }
    
    next();
  } catch (error) {
    // If token is invalid, just proceed without user
    next();
  }
};

module.exports = {
  authenticate,
  optionalAuth
};