// routes/categories.routes.js - FIXED response format
const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const Product = require('../models/Product');
const { asyncHandler } = require('../middleware/errorHandler');

/**
 * GET /api/categories
 * Get all categories
 */
router.get('/', asyncHandler(async (req, res) => {
  const { featured } = req.query;
  
  let query = {};
  if (featured === 'true') {
    query.featured = true;
  }
  
  const categories = await Category.find(query).sort({ createdAt: -1 });
  
  // Return array directly (not wrapped in object) to match frontend expectation
  res.json(categories);
}));

/**
 * GET /api/categories/:id
 * Get single category by ID
 */
router.get('/:id', asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  
  if (!category) {
    return res.status(404).json({ 
      error: 'Not Found',
      message: 'Category not found' 
    });
  }
  
  res.json(category);
}));

/**
 * GET /api/categories/:id/products
 * Get all products in a category
 */
router.get('/:id/products', asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, sort = 'createdAt', order = 'desc' } = req.query;
  
  // Check if category exists
  const category = await Category.findById(req.params.id);
  if (!category) {
    return res.status(404).json({ 
      error: 'Not Found',
      message: 'Category not found' 
    });
  }
  
  // Build sort object
  const sortObj = {};
  sortObj[sort] = order === 'asc' ? 1 : -1;
  
  // Get products with pagination
  const skip = (page - 1) * limit;
  const products = await Product.find({ category: req.params.id })
    .sort(sortObj)
    .skip(skip)
    .limit(parseInt(limit));
  
  const totalProducts = await Product.countDocuments({ category: req.params.id });
  
  res.json({
    category: {
      id: category._id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      image: category.image
    },
    products,
    pagination: {
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalProducts / limit),
      totalProducts,
      limit: parseInt(limit)
    }
  });
}));

module.exports = router;