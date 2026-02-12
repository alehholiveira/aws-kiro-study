/**
 * Validation Middleware
 * Provides request validation using Joi schemas
 * Validates req.body, req.params, or req.query and attaches validated data to req.validated
 * Requirements: 5.5
 */

/**
 * Creates a middleware function that validates incoming requests using a Joi schema
 * @param {Joi.Schema} schema - The Joi schema to validate against
 * @returns {Function} Express middleware function
 */
function validateRequest(schema) {
  return (req, res, next) => {
    // Determine which part of the request to validate
    // Priority: body > params > query
    const dataToValidate = req.body && Object.keys(req.body).length > 0
      ? req.body
      : req.params && Object.keys(req.params).length > 0
        ? req.params
        : req.query;

    // Validate the data against the schema
    const { error, value } = schema.validate(dataToValidate, {
      abortEarly: false, // Return all errors, not just the first one
      stripUnknown: true // Remove unknown keys from the validated data
    });

    // If validation fails, return 400 with Joi error message
    if (error) {
      return res.status(400).json({
        error: error.details[0].message
      });
    }

    // Attach validated data to req.validated for use in controllers
    req.validated = value;
    next();
  };
}

module.exports = validateRequest;
