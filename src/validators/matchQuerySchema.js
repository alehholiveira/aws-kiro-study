const Joi = require('joi');

/**
 * Nations Match Query Validation Schema
 * Validates team1 and team2 query parameters for match searches
 * Ensures both team names are non-empty strings with trimming
 * Requirements: 5.4
 */
const matchQuerySchema = Joi.object({
  team1: Joi.string()
    .trim()
    .min(1)
    .required()
    .messages({
      'string.empty': 'Team 1 name cannot be empty',
      'any.required': 'Team 1 is required'
    }),
  team2: Joi.string()
    .trim()
    .min(1)
    .required()
    .messages({
      'string.empty': 'Team 2 name cannot be empty',
      'any.required': 'Team 2 is required'
    })
});

module.exports = matchQuerySchema;
