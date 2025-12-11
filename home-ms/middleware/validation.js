// middleware/validation.js
const Joi = require('joi');

/**
 * Validation middleware factory
 */
const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Invalid request data',
        details: error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message
        }))
      });
    }

    req.validatedBody = value;
    next();
  };
};

/**
 * Common validation schemas
 */
const schemas = {
  // User registration
  register: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(100).required()
  }),

  // User login
  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }),

  // Add to cart
  addToCart: Joi.object({
    productId: Joi.number().integer().positive().required(),
    quantity: Joi.number().integer().min(1).max(100).default(1)
  }),

  // Update cart item
  updateCartItem: Joi.object({
    quantity: Joi.number().integer().min(0).max(100).required()
  }),

  // Create order
  createOrder: Joi.object({
    shippingAddress: Joi.object({
      street: Joi.string().required(),
      city: Joi.string().required(),
      state: Joi.string().required(),
      zipCode: Joi.string().required(),
      country: Joi.string().required()
    }).required(),
    paymentMethod: Joi.string().valid('card', 'paypal', 'cod').required()
  }),

  // Update profile
  updateProfile: Joi.object({
    name: Joi.string().min(2).max(100),
    email: Joi.string().email(),
    avatar: Joi.string().uri()
  })
};

module.exports = {
  validate,
  schemas
};