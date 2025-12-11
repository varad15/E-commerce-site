// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String
  },
  isNewUser: {  // Changed from 'isNew' to 'isNewUser' to avoid conflict
    type: Boolean,
    default: true
  },
  addresses: [{
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
    isDefault: Boolean
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);