const Joi = require('joi');

/**
 * Year Validation Schema
 * Validates basic year input (integer, minimum 1950)
 * Used for general year validation in API endpoints
 * Requirements: 5.2
 */
const yearSchema = Joi.object({
  year: Joi.number()
    .integer()
    .min(1950)
    .required()
    .messages({
      'number.base': 'Year must be a number',
      'number.integer': 'Year must be an integer',
      'number.min': 'Year must be 1950 or later',
      'any.required': 'Year is required'
    })
});

module.exports = yearSchema;
