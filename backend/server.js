require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./config/database');
const seedDatabase = require('./database/seed');
const recipeRoutes = require('./routes/recipeRoutes');
const favouriteRoutes = require('./routes/favouriteRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend development
app.use(cors({
  origin: '*', // Allow all origins for dev / tests
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Visitor-ID']
}));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Auto-seed if database is empty
try {
  const countRow = db.prepare('SELECT COUNT(*) as count FROM recipes').get();
  if (countRow && countRow.count === 0) {
    console.log('Database empty on startup. Automatically seeding initial recipes...');
    seedDatabase();
  }
} catch (err) {
  console.warn('Initial seed check warning:', err.message);
}

// Root endpoint as specified in requirements
app.get('/', (req, res) => {
  res.json({
    message: 'RecipeHub Backend is Running!'
  });
});

// API Routes
app.use('/api/recipes', recipeRoutes);
app.use('/api/favourites', favouriteRoutes);

// 404 Route handler for undefined API routes
app.use('/api', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint '${req.originalUrl}' not found.`
  });
});

// Centralized error handler middleware
app.use(errorHandler);

// Start server
const server = app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`🍳 RecipeHub Backend Server running on:`);
  console.log(`   http://localhost:${PORT}`);
  console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`===============================================`);
});

module.exports = { app, server };
