/**
 * Express Application Setup
 * Initializes and configures the Express application with middleware and routes
 * Requirements: 7.1, 7.6
 */

const express = require('express');
const cors = require('cors');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

// Import routes
const healthRoutes = require('./routes/health');
const winnerRoutes = require('./routes/winners');
const matchRoutes = require('./routes/matches');
const simulateRoutes = require('./routes/simulate');

// Initialize Express app
const app = express();

// Add CORS middleware for cross-origin requests
// Requirements: 7.6
app.use(cors());

// Add JSON body parser middleware
app.use(express.json());

// Mount health check route (no /api prefix for health checks)
app.use(healthRoutes);

// Mount API routes
app.use('/api/winners', winnerRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api', simulateRoutes);

// Add 404 handler for undefined routes (must be after all routes)
app.use(notFoundHandler);

// Add global error handling middleware (must be last)
app.use(errorHandler);

module.exports = app;
