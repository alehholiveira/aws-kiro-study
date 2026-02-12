/**
 * Global Error Handler Middleware
 * Catches all unhandled errors in the application
 * Logs errors with stack traces and returns appropriate error responses
 * Requirements: 7.3, 7.5
 */

/**
 * 404 Not Found handler middleware
 * Handles requests to undefined routes
 * Must be registered after all routes but before the global error handler
 * Requirements: 7.4
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
function notFoundHandler(req, res) {
  res.status(404).json({
    error: `Route ${req.method} ${req.path} not found`
  });
}

/**
 * Global error handling middleware
 * Must be registered after all routes in Express app
 * 
 * @param {Error} err - The error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
function errorHandler(err, req, res, next) {
  // Log error with stack trace for debugging
  console.error('Error occurred:', {
    message: err.message,
    stack: err.stack,
    method: req.method,
    path: req.path,
    params: req.params,
    query: req.query,
    body: req.body
  });

  // Determine status code (use err.status if available, otherwise 500)
  const statusCode = err.status || err.statusCode || 500;

  // Return generic error message for 500 errors (don't expose internal details)
  // For other errors, use the error message
  const message = statusCode === 500 
    ? 'Internal server error' 
    : err.message || 'An error occurred';

  res.status(statusCode).json({
    error: message
  });
}

module.exports = { errorHandler, notFoundHandler };
