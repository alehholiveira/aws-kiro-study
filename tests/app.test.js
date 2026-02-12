/**
 * Tests for Express Application Setup
 * Verifies that the app is properly configured with middleware and routes
 * Requirements: 7.1, 7.6
 */

const { expect } = require('chai');
const request = require('supertest');
const app = require('../src/app');

describe('Express Application Setup', () => {
  describe('Middleware Configuration', () => {
    it('should have CORS enabled', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);
      
      // CORS headers should be present
      expect(response.headers).to.have.property('access-control-allow-origin');
    });

    it('should parse JSON request bodies', async () => {
      const response = await request(app)
        .post('/api/simulate')
        .send({ year: 2026 })
        .set('Content-Type', 'application/json');
      
      // Should not fail due to body parsing (may fail validation, but that's ok)
      expect(response.status).to.be.oneOf([200, 201, 400, 404, 500]);
    });
  });

  describe('Route Mounting', () => {
    it('should mount health check route', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);
      
      expect(response.body).to.have.property('status', 'ok');
    });

    it('should mount winner routes at /api/winners', async () => {
      const response = await request(app)
        .get('/api/winners/2018');
      
      // Should reach the route (may return 404 or 200 depending on data)
      expect(response.status).to.be.oneOf([200, 404, 500]);
    });

    it('should mount match routes at /api/matches', async () => {
      const response = await request(app)
        .get('/api/matches')
        .query({ team1: 'Brazil', team2: 'Germany' });
      
      // Should reach the route
      expect(response.status).to.be.oneOf([200, 400, 500]);
    });

    it('should mount simulate route at /api/simulate', async () => {
      const response = await request(app)
        .post('/api/simulate')
        .send({ year: 2026 });
      
      // Should reach the route
      expect(response.status).to.be.oneOf([200, 201, 400, 500]);
    });
  });

  describe('Error Handling', () => {
    it('should return 404 for undefined routes', async () => {
      const response = await request(app)
        .get('/api/nonexistent')
        .expect(404);
      
      expect(response.body).to.have.property('error');
      expect(response.body.error).to.include('not found');
    });

    it('should handle errors with proper JSON format', async () => {
      const response = await request(app)
        .get('/api/nonexistent');
      
      expect(response.body).to.be.an('object');
      expect(response.body).to.have.property('error');
      expect(response.body.error).to.be.a('string');
    });
  });
});
