// routes/orders.routes.js - MongoDB version
const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { asyncHandler } = require('../middleware/errorHandler');
const { validate, schemas } = require('../middleware/validation');

/**
 * GET /api/orders
 * Get user's orders
 */
router.get('/', asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status } = req.query;
  
  // Build query
  let query = { user: req.user.id };
  if (status) {
    query.status = status;
  }
  
  // Pagination
  const skip = (page - 1) * limit;
  const userOrders = await Order.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));
  
  const totalOrders = await Order.countDocuments(query);
  
  res.json({
    orders: userOrders,
    pagination: {
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalOrders / limit),
      totalOrders,
      limit: parseInt(limit)
    }
  });
}));

/**
 * GET /api/orders/:id
 * Get single order by ID
 */
router.get('/:id', asyncHandler(async (req, res) => {
  const order = await Order.findOne({ 
    _id: req.params.id, 
    user: req.user.id 
  }).populate('items.product');
  
  if (!order) {
    return res.status(404).json({ 
      error: 'Not Found',
      message: 'Order not found' 
    });
  }
  
  res.json(order);
}));

/**
 * POST /api/orders
 * Create new order from cart
 */
router.post('/', validate(schemas.createOrder), asyncHandler(async (req, res) => {
  const { shippingAddress, paymentMethod } = req.validatedBody;
  
  // Get user's cart
  const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
  
  if (!cart || cart.items.length === 0) {
    return res.status(400).json({ 
      error: 'Bad Request',
      message: 'Cart is empty' 
    });
  }
  
  // Prepare order items and check stock
  const orderItems = [];
  for (const item of cart.items) {
    const product = item.product;
    
    if (!product.inStock || product.stockQuantity < item.quantity) {
      return res.status(400).json({ 
        error: 'Bad Request',
        message: `Product ${product.name} is out of stock or insufficient quantity` 
      });
    }
    
    orderItems.push({
      product: product._id,
      name: product.name,
      price: product.price,
      quantity: item.quantity,
      image: product.image
    });
  }
  
  // Calculate totals
  const subtotal = orderItems.reduce((sum, item) => 
    sum + (item.price * item.quantity), 0
  );
  const shipping = subtotal > 50 ? 0 : 5.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;
  
  // Create order
  const newOrder = await Order.create({
    user: req.user.id,
    orderNumber: `ECO-${Date.now()}`,
    items: orderItems,
    shippingAddress,
    paymentMethod,
    subtotal: parseFloat(subtotal.toFixed(2)),
    shipping: parseFloat(shipping.toFixed(2)),
    tax: parseFloat(tax.toFixed(2)),
    total: parseFloat(total.toFixed(2)),
    status: 'pending',
    paymentStatus: 'pending'
  });
  
  // Update product stock
  for (const item of orderItems) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stockQuantity: -item.quantity }
    });
    
    // Update inStock status
    const product = await Product.findById(item.product);
    if (product.stockQuantity === 0) {
      product.inStock = false;
      await product.save();
    }
  }
  
  // Clear cart
  cart.items = [];
  await cart.save();
  
  res.status(201).json({
    message: 'Order created successfully',
    order: newOrder
  });
}));

/**
 * PATCH /api/orders/:id/cancel
 * Cancel an order
 */
router.patch('/:id/cancel', asyncHandler(async (req, res) => {
  const order = await Order.findOne({ 
    _id: req.params.id, 
    user: req.user.id 
  });
  
  if (!order) {
    return res.status(404).json({ 
      error: 'Not Found',
      message: 'Order not found' 
    });
  }
  
  // Check if order can be cancelled
  if (order.status === 'delivered' || order.status === 'cancelled') {
    return res.status(400).json({ 
      error: 'Bad Request',
      message: 'Order cannot be cancelled' 
    });
  }
  
  // Update order status
  order.status = 'cancelled';
  await order.save();
  
  // Restore product stock
  for (const item of order.items) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stockQuantity: item.quantity },
      inStock: true
    });
  }
  
  res.json({
    message: 'Order cancelled successfully',
    order
  });
}));

module.exports = router;