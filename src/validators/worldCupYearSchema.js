const Joi = require('joi');

/**
 * World Cup Year Validation Schema
 * Validates that a year follows the World Cup year pattern (1950 + 4n)
 * Used for simulation endpoint to ensure valid World Cup years
 * Requirements: 5.3
 */
const worldCupYearSchema = Joi.object({
  year: Joi.number()
    .integer()
    .min(1950)
    .custom((value, helpers) => {
      if ((value - 1950) % 4 !== 0) {
        return helpers.error('any.invalid');
      }
      return value;
    })
    .required()
    .messages({
      'any.invalid': 'Year must be a valid World Cup year (1950, 1954, 1958, ...)',
      'number.base': 'Year must be a number',
      'number.integer': 'Year must be an integer',
      'number.min': 'Year must be 1950 or later',
      'any.required': 'Year is required'
    })
});

module.exports = worldCupYearSchema;
