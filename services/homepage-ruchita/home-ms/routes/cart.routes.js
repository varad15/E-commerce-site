// routes/cart.routes.js - MongoDB version
const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { asyncHandler } = require('../middleware/errorHandler');
const { validate, schemas } = require('../middleware/validation');

/**
 * GET /api/cart
 * Get user's cart
 */
router.get('/', asyncHandler(async (req, res) => {
  let cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
  
  if (!cart) {
    cart = await Cart.create({ user: req.user.id, items: [] });
  }
  
  // Calculate totals
  const enrichedItems = cart.items.map(item => ({
    id: item._id,
    productId: item.product._id,
    quantity: item.quantity,
    name: item.product.name,
    price: item.product.price,
    image: item.product.image,
    inStock: item.product.inStock,
    stockQuantity: item.product.stockQuantity
  }));
  
  const subtotal = enrichedItems.reduce((sum, item) => 
    sum + (item.price * item.quantity), 0
  );
  
  const itemCount = enrichedItems.reduce((sum, item) => 
    sum + item.quantity, 0
  );
  
  res.json({
    items: enrichedItems,
    subtotal: parseFloat(subtotal.toFixed(2)),
    itemCount
  });
}));

/**
 * POST /api/cart/items
 * Add item to cart
 */
router.post('/items', validate(schemas.addToCart), asyncHandler(async (req, res) => {
  const { productId, quantity } = req.validatedBody;
  
  // Check if product exists
  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({ 
      error: 'Not Found',
      message: 'Product not found' 
    });
  }
  
  // Check stock
  if (!product.inStock) {
    return res.status(400).json({ 
      error: 'Bad Request',
      message: 'Product is out of stock' 
    });
  }
  
  if (product.stockQuantity < quantity) {
    return res.status(400).json({ 
      error: 'Bad Request',
      message: `Only ${product.stockQuantity} items available in stock` 
    });
  }
  
  // Get or create cart
  let cart = await Cart.findOne({ user: req.user.id });
  if (!cart) {
    cart = await Cart.create({ user: req.user.id, items: [] });
  }
  
  // Check if item already in cart
  const existingItemIndex = cart.items.findIndex(
    item => item.product.toString() === productId
  );
  
  if (existingItemIndex > -1) {
    // Update quantity
    const newQuantity = cart.items[existingItemIndex].quantity + quantity;
    
    if (product.stockQuantity < newQuantity) {
      return res.status(400).json({ 
        error: 'Bad Request',
        message: `Only ${product.stockQuantity} items available in stock` 
      });
    }
    
    cart.items[existingItemIndex].quantity = newQuantity;
  } else {
    // Add new item
    cart.items.push({ product: productId, quantity });
  }
  
  await cart.save();
  await cart.populate('items.product');
  
  // Calculate totals
  const subtotal = cart.items.reduce((sum, item) => 
    sum + (item.product.price * item.quantity), 0
  );
  const itemCount = cart.items.reduce((sum, item) => 
    sum + item.quantity, 0
  );
  
  res.status(201).json({
    message: 'Item added to cart',
    cart: {
      items: cart.items,
      subtotal: parseFloat(subtotal.toFixed(2)),
      itemCount
    }
  });
}));

/**
 * PUT /api/cart/items/:itemId
 * Update cart item quantity
 */
router.put('/items/:itemId', validate(schemas.updateCartItem), asyncHandler(async (req, res) => {
  const { itemId } = req.params;
  const { quantity } = req.validatedBody;
  
  const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
  if (!cart) {
    return res.status(404).json({ 
      error: 'Not Found',
      message: 'Cart not found' 
    });
  }
  
  const itemIndex = cart.items.findIndex(item => item._id.toString() === itemId);
  if (itemIndex === -1) {
    return res.status(404).json({ 
      error: 'Not Found',
      message: 'Cart item not found' 
    });
  }
  
  const product = cart.items[itemIndex].product;
  
  // Check stock
  if (quantity > 0 && product.stockQuantity < quantity) {
    return res.status(400).json({ 
      error: 'Bad Request',
      message: `Only ${product.stockQuantity} items available in stock` 
    });
  }
  
  // Remove item if quantity is 0
  if (quantity === 0) {
    cart.items.splice(itemIndex, 1);
  } else {
    cart.items[itemIndex].quantity = quantity;
  }
  
  await cart.save();
  
  // Calculate totals
  const subtotal = cart.items.reduce((sum, item) => 
    sum + (item.product.price * item.quantity), 0
  );
  const itemCount = cart.items.reduce((sum, item) => 
    sum + item.quantity, 0
  );
  
  res.json({
    message: 'Cart updated',
    cart: {
      items: cart.items,
      subtotal: parseFloat(subtotal.toFixed(2)),
      itemCount
    }
  });
}));

/**
 * DELETE /api/cart/items/:itemId
 * Remove item from cart
 */
router.delete('/items/:itemId', asyncHandler(async (req, res) => {
  const { itemId } = req.params;
  
  const cart = await Cart.findOne({ user: req.user.id });
  if (!cart) {
    return res.status(404).json({ 
      error: 'Not Found',
      message: 'Cart not found' 
    });
  }
  
  const itemIndex = cart.items.findIndex(item => item._id.toString() === itemId);
  if (itemIndex === -1) {
    return res.status(404).json({ 
      error: 'Not Found',
      message: 'Cart item not found' 
    });
  }
  
  cart.items.splice(itemIndex, 1);
  await cart.save();
  await cart.populate('items.product');
  
  // Calculate totals
  const subtotal = cart.items.reduce((sum, item) => 
    sum + (item.product.price * item.quantity), 0
  );
  const itemCount = cart.items.reduce((sum, item) => 
    sum + item.quantity, 0
  );
  
  res.json({
    message: 'Item removed from cart',
    cart: {
      items: cart.items,
      subtotal: parseFloat(subtotal.toFixed(2)),
      itemCount
    }
  });
}));

/**
 * DELETE /api/cart
 * Clear entire cart
 */
router.delete('/', asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user.id });
  if (cart) {
    cart.items = [];
    await cart.save();
  }
  
  res.json({
    message: 'Cart cleared',
    cart: {
      items: [],
      subtotal: 0,
      itemCount: 0
    }
  });
}));

module.exports = router;