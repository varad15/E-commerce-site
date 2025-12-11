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
      const errors = error.details.map(detail => detail.message);
      return res.status(400).json({
        error: 'Validation Error',
        message: errors.join(', '),
        details: error.details
      });
    }

    req.validatedBody = value;
    next();
  };
};

/**
 * Validation schemas
 */
const schemas = {
  addToCart: Joi.object({
    productId: Joi.string().required().length(24),
    quantity: Joi.number().integer().min(1).max(99).default(1)
  }),

  updateCartItem: Joi.object({
    quantity: Joi.number().integer().min(0).max(99).required()
  }),

  createOrder: Joi.object({
    shippingAddress: Joi.object({
      street: Joi.string().required(),
      city: Joi.string().required(),
      state: Joi.string().required(),
      zipCode: Joi.string().required(),
      country: Joi.string().required()
    }).required(),
    paymentMethod: Joi.string()
      .valid('credit_card', 'debit_card', 'paypal', 'cod')
      .required()
  })
};

module.exports = {
  validate,
  schemas
};