// routes/products.routes.js - FIXED with slug endpoint
const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { asyncHandler } = require('../middleware/errorHandler');

/**
 * GET /api/products/featured
 * Get featured products
 */
router.get('/featured', asyncHandler(async (req, res) => {
  const { limit = 10 } = req.query;
  
  const featuredProducts = await Product.find({ featured: true })
    .limit(parseInt(limit))
    .sort({ createdAt: -1 });

  res.json(featuredProducts);
}));

/**
 * GET /api/products/search
 * Search products by text query
 */
router.get('/search', asyncHandler(async (req, res) => {
  const { q, page = 1, limit = 20 } = req.query;

  if (!q) {
    return res.status(400).json({ 
      error: 'Bad Request',
      message: 'Search query is required' 
    });
  }

  const skip = (page - 1) * limit;

  // Search using regex for name, categoryName, description, tags
  const searchRegex = new RegExp(q, 'i'); // case-insensitive
  
  const query = {
    $or: [
      { name: searchRegex },
      { categoryName: searchRegex },
      { description: searchRegex },
      { tags: searchRegex }
    ]
  };

  const results = await Product.find(query)
    .skip(skip)
    .limit(parseInt(limit))
    .sort({ featured: -1, createdAt: -1 });

  const totalResults = await Product.countDocuments(query);

  res.json({
    query: q,
    results,
    pagination: {
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalResults / limit),
      totalResults,
      limit: parseInt(limit)
    }
  });
}));

/**
 * GET /api/products/slug/:slug
 * Get single product by slug
 */
router.get('/slug/:slug', asyncHandler(async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug }).populate('category');
  
  if (!product) {
    return res.status(404).json({ 
      error: 'Not Found',
      message: 'Product not found' 
    });
  }
  
  res.json(product);
}));

/**
 * GET /api/products/:id
 * Get single product by ID
 */
router.get('/:id', asyncHandler(async (req, res) => {
  // Check if it's a valid MongoDB ObjectId
  if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ 
      error: 'Bad Request',
      message: 'Invalid product ID' 
    });
  }

  const product = await Product.findById(req.params.id).populate('category');
  
  if (!product) {
    return res.status(404).json({ 
      error: 'Not Found',
      message: 'Product not found' 
    });
  }
  
  res.json(product);
}));

/**
 * GET /api/products
 * Get all products with filters
 */
router.get('/', asyncHandler(async (req, res) => {
  const { 
    category, 
    featured, 
    inStock, 
    minPrice,
    maxPrice,
    sort = 'createdAt', 
    order = 'desc',
    page = 1, 
    limit = 20 
  } = req.query;
  
  // Build query
  let query = {};
  
  if (category) {
    // Support both category slug and ID
    if (category.match(/^[0-9a-fA-F]{24}$/)) {
      query.category = category;
    } else {
      // Search by category slug in categoryName or use Category model
      query.$or = [
        { categoryName: new RegExp(category, 'i') }
      ];
    }
  }
  
  if (featured === 'true') {
    query.featured = true;
  }
  
  if (inStock === 'true') {
    query.inStock = true;
  }

  // Price range filter
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = parseFloat(minPrice);
    if (maxPrice) query.price.$lte = parseFloat(maxPrice);
  }
  
  // Build sort object
  const sortObj = {};
  sortObj[sort] = order === 'asc' ? 1 : -1;
  
  // Pagination
  const skip = (page - 1) * limit;
  const products = await Product.find(query)
    .sort(sortObj)
    .skip(skip)
    .limit(parseInt(limit));
  
  const totalProducts = await Product.countDocuments(query);
  
  res.json({
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