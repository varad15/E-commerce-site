// routes/user.routes.js - MongoDB version
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { asyncHandler } = require('../middleware/errorHandler');
const { validate, schemas } = require('../middleware/validation');

/**
 * GET /api/user/profile
 * Get current user profile
 */
router.get('/profile', asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  
  if (!user) {
    return res.status(404).json({ 
      error: 'Not Found',
      message: 'User not found' 
    });
  }
  
  res.json(user);
}));

/**
 * PUT /api/user/profile
 * Update user profile
 */
router.put('/profile', validate(schemas.updateProfile), asyncHandler(async (req, res) => {
  const { name, email, avatar } = req.validatedBody;
  
  const user = await User.findById(req.user.id);
  if (!user) {
    return res.status(404).json({ 
      error: 'Not Found',
      message: 'User not found' 
    });
  }
  
  // Check if email is being changed and if it's already taken
  if (email && email !== user.email) {
    const emailExists = await User.findOne({ email, _id: { $ne: req.user.id } });
    if (emailExists) {
      return res.status(409).json({ 
        error: 'Conflict',
        message: 'Email already in use' 
      });
    }
  }
  
  // Update user fields
  if (name) user.name = name;
  if (email) user.email = email;
  if (avatar) user.avatar = avatar;
  
  await user.save();
  
  // Return user without password
  const userObject = user.toObject();
  delete userObject.password;
  
  res.json({
    message: 'Profile updated successfully',
    user: userObject
  });
}));

/**
 * GET /api/user/addresses
 * Get user addresses
 */
router.get('/addresses', asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select('addresses');
  
  if (!user) {
    return res.status(404).json({ 
      error: 'Not Found',
      message: 'User not found' 
    });
  }
  
  res.json(user.addresses || []);
}));

/**
 * POST /api/user/addresses
 * Add new address
 */
router.post('/addresses', asyncHandler(async (req, res) => {
  const { street, city, state, zipCode, country, isDefault } = req.body;
  
  const user = await User.findById(req.user.id);
  if (!user) {
    return res.status(404).json({ 
      error: 'Not Found',
      message: 'User not found' 
    });
  }
  
  // If this is default, unset other default addresses
  if (isDefault) {
    user.addresses.forEach(addr => addr.isDefault = false);
  }
  
  user.addresses.push({
    street,
    city,
    state,
    zipCode,
    country,
    isDefault: isDefault || false
  });
  
  await user.save();
  
  res.status(201).json({
    message: 'Address added successfully',
    addresses: user.addresses
  });
}));

module.exports = router;