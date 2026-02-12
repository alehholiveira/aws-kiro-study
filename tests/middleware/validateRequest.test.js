const { expect } = require('chai');
const validateRequest = require('../../src/middleware/validateRequest');
const Joi = require('joi');

describe('validateRequest Middleware', () => {
  // Mock request, response, and next function
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {},
      params: {},
      query: {}
    };
    res = {
      status: function(code) {
        this.statusCode = code;
        return this;
      },
      json: function(data) {
        this.data = data;
        return this;
      }
    };
    next = function() {
      next.called = true;
    };
    next.called = false;
  });

  describe('Valid inputs', () => {
    it('should validate req.body and attach to req.validated', () => {
      const schema = Joi.object({
        name: Joi.string().required()
      });
      const middleware = validateRequest(schema);

      req.body = { name: 'Brazil' };
      middleware(req, res, next);

      expect(next.called).to.be.true;
      expect(req.validated).to.deep.equal({ name: 'Brazil' });
    });

    it('should validate req.params when body is empty', () => {
      const schema = Joi.object({
        year: Joi.number().required()
      });
      const middleware = validateRequest(schema);

      req.params = { year: 2022 };
      middleware(req, res, next);

      expect(next.called).to.be.true;
      expect(req.validated).to.deep.equal({ year: 2022 });
    });

    it('should validate req.query when body and params are empty', () => {
      const schema = Joi.object({
        team1: Joi.string().required(),
        team2: Joi.string().required()
      });
      const middleware = validateRequest(schema);

      req.query = { team1: 'Brazil', team2: 'Germany' };
      middleware(req, res, next);

      expect(next.called).to.be.true;
      expect(req.validated).to.deep.equal({ team1: 'Brazil', team2: 'Germany' });
    });

    it('should strip unknown keys from validated data', () => {
      const schema = Joi.object({
        year: Joi.number().required()
      });
      const middleware = validateRequest(schema);

      req.body = { year: 2022, extraField: 'should be removed' };
      middleware(req, res, next);

      expect(next.called).to.be.true;
      expect(req.validated).to.deep.equal({ year: 2022 });
      expect(req.validated.extraField).to.be.undefined;
    });
  });

  describe('Invalid inputs', () => {
    it('should return 400 with error message on validation failure', () => {
      const schema = Joi.object({
        year: Joi.number().required()
      });
      const middleware = validateRequest(schema);

      req.body = { year: 'invalid' };
      middleware(req, res, next);

      expect(next.called).to.be.false;
      expect(res.statusCode).to.equal(400);
      expect(res.data).to.have.property('error');
      expect(res.data.error).to.include('must be a number');
    });

    it('should return 400 when required field is missing', () => {
      const schema = Joi.object({
        name: Joi.string().required()
      });
      const middleware = validateRequest(schema);

      req.body = {};
      middleware(req, res, next);

      expect(next.called).to.be.false;
      expect(res.statusCode).to.equal(400);
      expect(res.data).to.have.property('error');
      expect(res.data.error).to.include('required');
    });

    it('should return Joi error message in response', () => {
      const schema = Joi.object({
        year: Joi.number().min(1950).required().messages({
          'number.min': 'Year must be 1950 or later'
        })
      });
      const middleware = validateRequest(schema);

      req.body = { year: 1949 };
      middleware(req, res, next);

      expect(next.called).to.be.false;
      expect(res.statusCode).to.equal(400);
      expect(res.data.error).to.equal('Year must be 1950 or later');
    });
  });

  describe('Error response format', () => {
    it('should return error in correct JSON format', () => {
      const schema = Joi.object({
        year: Joi.number().required()
      });
      const middleware = validateRequest(schema);

      req.body = { year: 'abc' };
      middleware(req, res, next);

      expect(res.data).to.be.an('object');
      expect(res.data).to.have.property('error');
      expect(res.data.error).to.be.a('string');
    });

    it('should return first error message when multiple errors exist', () => {
      const schema = Joi.object({
        year: Joi.number().min(1950).required(),
        name: Joi.string().required()
      });
      const middleware = validateRequest(schema);

      req.body = {}; // Missing both fields
      middleware(req, res, next);

      expect(res.statusCode).to.equal(400);
      expect(res.data.error).to.be.a('string');
      // Should return the first error message
      expect(res.data.error).to.satisfy(msg => 
        msg.includes('required') || msg.includes('Year') || msg.includes('name')
      );
    });
  });
});
