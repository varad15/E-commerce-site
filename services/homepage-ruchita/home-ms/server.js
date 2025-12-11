require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const connectDB = require('./config/database');
const { errorHandler } = require('./middleware/errorHandler');
const { authenticate } = require('./middleware/auth');

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

// Security middleware
app.use(helmet());
app.use(mongoSanitize());

// CORS configuration
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:8080',  // Auth service
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:8080',
  process.env.FRONTEND_URL
].filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
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
  maxAge: 600
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests, please try again later.' }
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: 'Too many authentication attempts' }
});

app.use('/api/', apiLimiter);
app.use('/api/auth/login', authLimiter);

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging (development)
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`📨 ${req.method} ${req.path}`);
    next();
  });
}

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'EcoMart API is running',
    database: 'MongoDB Atlas',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', authenticate, cartRoutes);  // ✅ Protected route
app.use('/api/user', authenticate, userRoutes);  // ✅ Protected route
app.use('/api/orders', authenticate, orderRoutes); // ✅ Protected route

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to EcoMart API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      categories: '/api/categories',
      products: '/api/products',
      cart: '/api/cart (requires auth)',
      user: '/api/user (requires auth)',
      orders: '/api/orders (requires auth)'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`
  });
});

// Global error handler
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log('\n' + '='.repeat(50));
  console.log('╔═══════════════════════════════════════╗');
  console.log('║   🌿 EcoMart API Server Running 🌿   ║');
  console.log('╚═══════════════════════════════════════╝');
  console.log(`📍 Port: ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`💾 Database: MongoDB Atlas`);
  console.log('🔐 Auth: JWT verification enabled');
  console.log('='.repeat(50) + '\n');
});

module.exports = app;