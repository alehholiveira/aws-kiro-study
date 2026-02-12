const express = require('express');
const request = require('supertest');
const { expect } = require('chai');
const { errorHandler, notFoundHandler } = require('../../src/middleware/errorHandler');

describe('Error Handler Middleware', () => {
  let app;

  beforeEach(() => {
    // Create a fresh Express app for each test
    app = express();
    app.use(express.json());
  });

  describe('Global Error Handler', () => {
    it('should catch unhandled errors and return 500 status', async () => {
      // Create a route that throws an error
      app.get('/test-error', (req, res, next) => {
        const error = new Error('Test error');
        next(error);
      });

      // Add error handler
      app.use(errorHandler);

      const response = await request(app).get('/test-error');

      expect(response.status).to.equal(500);
      expect(response.body).to.have.property('error');
      expect(response.body.error).to.equal('Internal server error');
    });

    it('should return generic error message for 500 errors', async () => {
      // Create a route that throws an error with sensitive information
      app.get('/test-error', (req, res, next) => {
        const error = new Error('Database connection failed: password=secret123');
        next(error);
      });

      app.use(errorHandler);

      const response = await request(app).get('/test-error');

      expect(response.status).to.equal(500);
      expect(response.body.error).to.equal('Internal server error');
      // Should not expose the actual error message with sensitive info
      expect(response.body.error).to.not.include('password');
    });

    it('should preserve custom status codes from errors', async () => {
      // Create a route that throws an error with custom status
      app.get('/test-404', (req, res, next) => {
        const error = new Error('Resource not found');
        error.status = 404;
        next(error);
      });

      app.use(errorHandler);

      const response = await request(app).get('/test-404');

      expect(response.status).to.equal(404);
      expect(response.body).to.have.property('error');
      expect(response.body.error).to.equal('Resource not found');
    });

    it('should handle errors with statusCode property', async () => {
      // Some error libraries use statusCode instead of status
      app.get('/test-400', (req, res, next) => {
        const error = new Error('Bad request');
        error.statusCode = 400;
        next(error);
      });

      app.use(errorHandler);

      const response = await request(app).get('/test-400');

      expect(response.status).to.equal(400);
      expect(response.body.error).to.equal('Bad request');
    });

    it('should handle errors without message', async () => {
      app.get('/test-no-message', (req, res, next) => {
        const error = new Error();
        error.status = 400;
        next(error);
      });

      app.use(errorHandler);

      const response = await request(app).get('/test-no-message');

      expect(response.status).to.equal(400);
      expect(response.body).to.have.property('error');
      expect(response.body.error).to.equal('An error occurred');
    });

    it('should return JSON response format', async () => {
      app.get('/test-json', (req, res, next) => {
        next(new Error('Test error'));
      });

      app.use(errorHandler);

      const response = await request(app).get('/test-json');

      expect(response.headers['content-type']).to.match(/application\/json/);
      expect(response.body).to.be.an('object');
      expect(response.body).to.have.property('error');
    });

    it('should handle synchronous errors thrown in routes', async () => {
      app.get('/test-sync-error', (req, res, next) => {
        throw new Error('Synchronous error');
      });

      app.use(errorHandler);

      const response = await request(app).get('/test-sync-error');

      expect(response.status).to.equal(500);
      expect(response.body.error).to.equal('Internal server error');
    });

    it('should handle async errors', async () => {
      app.get('/test-async-error', async (req, res, next) => {
        try {
          throw new Error('Async error');
        } catch (error) {
          next(error);
        }
      });

      app.use(errorHandler);

      const response = await request(app).get('/test-async-error');

      expect(response.status).to.equal(500);
      expect(response.body.error).to.equal('Internal server error');
    });
  });

  describe('404 Not Found Handler', () => {
    it('should return 404 for undefined routes', async () => {
      // Add some defined routes
      app.get('/api/defined', (req, res) => {
        res.json({ message: 'ok' });
      });

      // Add 404 handler after routes
      app.use(notFoundHandler);

      const response = await request(app).get('/api/undefined');

      expect(response.status).to.equal(404);
      expect(response.body).to.have.property('error');
      expect(response.body.error).to.include('not found');
    });

    it('should include request method and path in error message', async () => {
      app.use(notFoundHandler);

      const response = await request(app).get('/api/nonexistent');

      expect(response.status).to.equal(404);
      expect(response.body.error).to.include('GET');
      expect(response.body.error).to.include('/api/nonexistent');
    });

    it('should handle POST requests to undefined routes', async () => {
      app.use(notFoundHandler);

      const response = await request(app).post('/api/undefined');

      expect(response.status).to.equal(404);
      expect(response.body.error).to.include('POST');
      expect(response.body.error).to.include('/api/undefined');
    });

    it('should return JSON response format', async () => {
      app.use(notFoundHandler);

      const response = await request(app).get('/undefined');

      expect(response.headers['content-type']).to.match(/application\/json/);
      expect(response.body).to.be.an('object');
      expect(response.body).to.have.property('error');
    });

    it('should not interfere with defined routes', async () => {
      // Add a defined route
      app.get('/api/test', (req, res) => {
        res.json({ message: 'success' });
      });

      // Add 404 handler
      app.use(notFoundHandler);

      // Test defined route still works
      const definedResponse = await request(app).get('/api/test');
      expect(definedResponse.status).to.equal(200);
      expect(definedResponse.body.message).to.equal('success');

      // Test undefined route returns 404
      const undefinedResponse = await request(app).get('/api/undefined');
      expect(undefinedResponse.status).to.equal(404);
    });

    it('should handle routes with query parameters', async () => {
      app.use(notFoundHandler);

      const response = await request(app).get('/api/undefined?param=value');

      expect(response.status).to.equal(404);
      expect(response.body.error).to.include('/api/undefined');
    });
  });
});
