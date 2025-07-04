import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import connectDB from './config/db.js';
import userRoutes from './routes/users.js';
import transactionRoutes from './routes/transactions.js';


// Get __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Enhanced CORS configuration
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

// Robust body parsing
app.use(express.json({
  verify: (req, res, buf) => {
    req.rawBody = buf.toString();
    try {
      JSON.parse(req.rawBody);
    } catch (e) {
      throw new Error('Invalid JSON');
    }
  },
  limit: '10kb'
}));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Serve static files with proper caching headers
// Proper static file serving with caching headers
// Serve ALL frontend files (HTML, JS, CSS)
// Serve all static files from frontend directory
// Main static files (serves frontend/html as root)
app.use(express.static(path.join(__dirname, '../frontend')));


// Special handling for JS files
app.use('/js', express.static(path.join(__dirname, '../frontend/js'), {
  maxAge: '1d',
  setHeaders: (res) => {
    res.set('Cache-Control', 'public, max-age=86400');
  }
}));

// Connect to DB with error handling
// Modify your DB connection code
connectDB().then(() => {
  console.log('Database connected successfully');
}).catch(err => {
  console.error('Database connection error:', err.message);
  process.exit(1);
});

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Enhanced test endpoints
app.get('/api/test', (req, res) => {
  res.json({ 
    status: 'success',
    message: "GET test working!",
    timestamp: new Date().toISOString()
  });
});

app.post('/api/test', (req, res) => {
  try {
    console.log('Received body:', req.body);
    res.json({
      status: 'success',
      message: 'Test POST route working',
      received: req.body,
      rawBody: req.rawBody, // For debugging
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error('POST /api/test error:', err);
    res.status(400).json({
      status: 'error',
      message: err.message
    });
  }
});

// API routes with versioning
app.use("/api/users", userRoutes);
app.use("/api/v1/transactions", transactionRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    status: 'fail',
    message: `Cannot ${req.method} ${req.path}`
  });
});

// Enhanced error handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.error('Server error:', {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    request: {
      method: req.method,
      path: req.path,
      body: req.body
    }
  });

  res.status(statusCode).json({
    status: 'error',
    message: process.env.NODE_ENV === 'production' 
      ? 'Something went wrong!' 
      : err.message,
    ...(process.env.NODE_ENV === 'development' && {
      stack: err.stack
    })
  });
});

const PORT = process.env.PORT || 5500;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('Available endpoints:');
  console.log(`  GET  http://localhost:${PORT}/api/test`);
  console.log(`  POST http://localhost:${PORT}/api/test`);
  console.log(`  User routes: http://localhost:${PORT}/api/v1/users`);
  console.log(`  Transaction routes: http://localhost:${PORT}/api/v1/transactions`);
});

// Handle unhandled rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  server.close(() => process.exit(1));
});