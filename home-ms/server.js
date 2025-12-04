// server.js (or server-mongodb.js)
// Updated with CORS fix and rate limiting

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const connectDB = require('./config/database');

// Import routes
const authRoutes = require('./routes/auth.routes');
const categoryRoutes = require('./routes/categories.routes');
const productRoutes = require('./routes/products.routes');
const cartRoutes = require('./routes/cart.routes');
const userRoutes = require('./routes/user.routes');
const orderRoutes = require('./routes/orders.routes');

const app = express();
const PORT = process.env.PORT || 3001;

// Connect to MongoDB
connectDB();

// ==============================================
// SECURITY MIDDLEWARE
// ==============================================

// Helmet - Security headers
app.use(helmet());

// MongoDB Sanitization - Prevent NoSQL injection
app.use(mongoSanitize());

// ==============================================
// CORS CONFIGURATION (FIXED!)
// ==============================================

const allowedOrigins = [
  'http://localhost:3000',      // Create React App
  'http://localhost:5173',      // Vite
  'http://localhost:5174',      // Vite (alternate)
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5173',
  process.env.FRONTEND_URL      // Production URL from .env
].filter(Boolean); // Remove undefined values

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, Postman, curl)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('🚫 CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 600 // Cache preflight requests for 10 minutes
};

app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

// ==============================================
// RATE LIMITING
// ==============================================

// General API rate limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
  // Skip rate limiting for specific IPs (optional)
  skip: (req) => {
    // Skip rate limiting for local development
    const ip = req.ip || req.connection.remoteAddress;
    return ip === '::1' || ip === '127.0.0.1' || ip === '::ffff:127.0.0.1';
  }
});

// Strict rate limiter for authentication endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login/register requests per windowMs
  message: {
    error: 'Too many authentication attempts, please try again later.',
    retryAfter: '15 minutes'
  },
  skipSuccessfulRequests: true, // Don't count successful requests
  standardHeaders: true,
  legacyHeaders: false
});

// Moderate rate limiter for search endpoints
const searchLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30, // Limit each IP to 30 search requests per minute
  message: {
    error: 'Too many search requests, please slow down.',
    retryAfter: '1 minute'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Apply rate limiters
app.use('/api/', apiLimiter); // Apply to all API routes
app.use('/api/auth/login', authLimiter); // Strict limit for login
app.use('/api/auth/register', authLimiter); // Strict limit for register
app.use('/api/products/search', searchLimiter); // Moderate limit for search

// ==============================================
// BODY PARSER MIDDLEWARE
// ==============================================

app.use(express.json({ limit: '10mb' })); // Parse JSON with size limit
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ==============================================
// REQUEST LOGGING (Development)
// ==============================================

if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`📨 ${req.method} ${req.path} - Origin: ${req.get('origin') || 'No origin'}`);
    next();
  });
}

// ==============================================
// HEALTH CHECK ENDPOINT
// ==============================================

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'EcoMart API is running',
    database: 'MongoDB Atlas',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

// ==============================================
// API ROUTES
// ==============================================

app.use('/api/auth', authRoutes);       // route to authentication microservice
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);          // route to cart microservice
app.use('/api/user', userRoutes);          // route to user/admin microservice
app.use('/api/orders', orderRoutes);         // route to orders microservice

// ==============================================
// ROOT ENDPOINT
// ==============================================

app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to EcoMart API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      categories: '/api/categories',
      products: '/api/products',
      cart: '/api/cart',
      user: '/api/user',
      orders: '/api/orders'
    },
    documentation: 'See README.md for API documentation'
  });
});

// ==============================================
// 404 HANDLER
// ==============================================

app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`,
    availableRoutes: ['/api/auth', '/api/categories', '/api/products', '/api/cart', '/api/user', '/api/orders']
  });
});

// ==============================================
// ERROR HANDLER
// ==============================================

app.use((err, req, res, next) => {
  console.error('❌ Error:', err.message);
  
  // CORS error
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({
      error: 'CORS Error',
      message: 'Your origin is not allowed to access this API',
      origin: req.get('origin'),
      allowedOrigins: allowedOrigins
    });
  }

  // Rate limit error
  if (err.status === 429) {
    return res.status(429).json({
      error: 'Rate Limit Exceeded',
      message: err.message
    });
  }

  // Default error
  res.status(err.status || 500).json({
    error: err.name || 'Internal Server Error',
    message: err.message || 'Something went wrong',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// ==============================================
// START SERVER
// ==============================================

app.listen(PORT, () => {
  console.log('\n' + '='.repeat(50));
  console.log('╔═══════════════════════════════════════╗');
  console.log('║   🌿 EcoMart API Server Running 🌿   ║');
  console.log('╚═══════════════════════════════════════╝');
  console.log('');
  console.log(`📍 Port: ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`💾 Database: MongoDB Atlas`);
  console.log('');
  console.log('🔐 Security Features:');
  console.log('   ✅ CORS Protection (Multiple origins)');
  console.log('   ✅ Rate Limiting (API, Auth, Search)');
  console.log('   ✅ Helmet Security Headers');
  console.log('   ✅ MongoDB Sanitization');
  console.log('');
  console.log('🌐 Allowed Origins:');
  allowedOrigins.forEach(origin => {
    if (origin) console.log(`   • ${origin}`);
  });
  console.log('');
  console.log('📊 Rate Limits:');
  console.log('   • General API: 100 requests / 15 min');
  console.log('   • Authentication: 5 attempts / 15 min');
  console.log('   • Search: 30 requests / 1 min');
  console.log('');
  console.log('🔗 Endpoints:');
  console.log(`   • Health: http://localhost:${PORT}/health`);
  console.log(`   • API: http://localhost:${PORT}/api`);
  console.log('');
  console.log('='.repeat(50) + '\n');
});

module.exports = app;