const jwt = require('jsonwebtoken');

/**
 * Authentication middleware
 * Verifies JWT token from Auth Service
 */
const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'No token provided'
      });
    }

    const token = authHeader.substring(7);

    // Verify with SAME secret as auth service
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user info to request
    req.user = {
      id: decoded.sub || decoded.email,
      email: decoded.email || decoded.sub,
      role: decoded.role || 'USER',
      name: decoded.firstName || decoded.name
    };

    console.log('✅ User authenticated:', req.user.email);
    next();
  } catch (error) {
    console.error('❌ Auth error:', error.message);

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
 * Optional authentication
 * Doesn't fail if no token
 */
const optionalAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = {
        id: decoded.sub || decoded.email,
        email: decoded.email || decoded.sub,
        role: decoded.role || 'USER',
        name: decoded.firstName || decoded.name
      };
    }

    next();
  } catch (error) {
    // Just proceed without user
    next();
  }
};

/**
 * Admin-only middleware
 */
const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Authentication required'
    });
  }

  if (req.user.role !== 'ADMIN' && req.user.role !== 'ROLE_ADMIN') {
    return res.status(403).json({
      error: 'Forbidden',
      message: 'Admin access required'
    });
  }

  next();
};

module.exports = {
  authenticate,
  optionalAuth,
  requireAdmin
};