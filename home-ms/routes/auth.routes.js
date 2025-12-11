// routes/auth.routes.js - MongoDB version
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { asyncHandler } = require('../middleware/errorHandler');
const { validate, schemas } = require('../middleware/validation');

/**
 * POST /api/auth/register
 * Register a new user
 */
router.post('/register', validate(schemas.register), asyncHandler(async (req, res) => {
  const { name, email, password } = req.validatedBody;
  
  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(409).json({ 
      error: 'Conflict',
      message: 'User with this email already exists' 
    });
  }
  
  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);
  
  // Create new user
  const newUser = await User.create({
    name,
    email,
    password: hashedPassword,
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
    isNew: true
  });
  
  // Generate JWT token
  const token = jwt.sign(
    { 
      userId: newUser._id, 
      email: newUser.email,
      name: newUser.name
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
  
  // Return user without password
  const userObject = newUser.toObject();
  delete userObject.password;
  
  res.status(201).json({
    message: 'User registered successfully',
    token,
    user: userObject
  });
}));

/**
 * POST /api/auth/login
 * Login user
 */
router.post('/login', validate(schemas.login), asyncHandler(async (req, res) => {
  const { email, password } = req.validatedBody;
  
  // Find user
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ 
      error: 'Unauthorized',
      message: 'Invalid email or password' 
    });
  }
  
  // Verify password
  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    return res.status(401).json({ 
      error: 'Unauthorized',
      message: 'Invalid email or password' 
    });
  }
  
  // Generate JWT token
  const token = jwt.sign(
    { 
      userId: user._id, 
      email: user.email,
      name: user.name
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
  
  // Return user without password
  const userObject = user.toObject();
  delete userObject.password;
  
  res.json({
    message: 'Login successful',
    token,
    user: userObject
  });
}));

/**
 * POST /api/auth/logout
 * Logout user (client-side token removal)
 */
router.post('/logout', asyncHandler(async (req, res) => {
  res.json({
    message: 'Logout successful'
  });
}));

module.exports = router;